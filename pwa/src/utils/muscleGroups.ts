import type { BodyAreaDisplayName, MuscleGroupDisplayName } from 'gym-pwa-api/types';
import type { MuscleMapSvgId } from '../components/MuscleMap/types';

export const muscleGroupToBodyArea: Record<MuscleGroupDisplayName, BodyAreaDisplayName> = {
  'Pectoralis Major': 'Chest',
  'Pectoralis Minor': 'Chest',
  'Latissimus Dorsi': 'Back',
  Trapezius: 'Back',
  Rhomboids: 'Back',
  'Erector Spinae': 'Back',
  'Rear Deltoids': 'Shoulders',
  'Front Deltoids': 'Shoulders',
  'Medial Deltoids': 'Shoulders',
  Biceps: 'Arms',
  Triceps: 'Arms',
  Forearms: 'Arms',
  Abdominals: 'Core',
  Obliques: 'Core',
  'Hip Flexors': 'Core',
  Glutes: 'Legs',
  Hamstrings: 'Legs',
  Quadriceps: 'Legs',
  Adductors: 'Legs',
  Calves: 'Legs',
};

export const muscleGroupToSvgIds: Record<MuscleGroupDisplayName, MuscleMapSvgId[]> = {
  'Pectoralis Major': ['chest'],
  'Pectoralis Minor': ['chest'],
  'Latissimus Dorsi': ['lats'],
  Trapezius: ['traps', 'traps-middle'],
  Rhomboids: ['traps-middle'],
  'Erector Spinae': ['lowerback'],
  'Rear Deltoids': ['rear-shoulders'],
  'Front Deltoids': ['front-shoulders'],
  'Medial Deltoids': ['front-shoulders', 'rear-shoulders'],
  Biceps: ['biceps'],
  Triceps: ['triceps'],
  Forearms: ['forearms'],
  Abdominals: ['abdominals'],
  Obliques: ['obliques'],
  'Hip Flexors': ['abdominals'],
  Glutes: ['glutes'],
  Hamstrings: ['hamstrings'],
  Quadriceps: ['quads'],
  Adductors: ['quads'],
  Calves: ['calves'],
};

export function getMuscleMapSvgIds(muscleGroups: MuscleGroupDisplayName[]): MuscleMapSvgId[] {
  const seen = new Set<MuscleMapSvgId>();
  const result: MuscleMapSvgId[] = [];
  for (const mg of muscleGroups) {
    for (const id of muscleGroupToSvgIds[mg]) {
      if (!seen.has(id)) {
        seen.add(id);
        result.push(id);
      }
    }
  }
  return result;
}

export function getVisibleViews(svgIds: MuscleMapSvgId[]): { front: boolean; back: boolean } {
  const frontIds: MuscleMapSvgId[] = [
    'abdominals',
    'biceps',
    'calves',
    'chest',
    'forearms',
    'front-shoulders',
    'hands',
    'obliques',
    'quads',
    'traps',
  ];
  const backIds: MuscleMapSvgId[] = [
    'calves',
    'forearms',
    'glutes',
    'hamstrings',
    'hands',
    'lats',
    'lowerback',
    'rear-shoulders',
    'traps',
    'traps-middle',
    'triceps',
  ];
  return {
    front: svgIds.some((id) => frontIds.includes(id)),
    back: svgIds.some((id) => backIds.includes(id)),
  };
}

export function getBodyAreasForExercise(
  primaryMuscleGroups: MuscleGroupDisplayName[],
  secondaryMuscleGroups: MuscleGroupDisplayName[],
  tertiaryMuscleGroups: MuscleGroupDisplayName[]
): BodyAreaDisplayName[] {
  const seen = new Set<BodyAreaDisplayName>();
  const result: BodyAreaDisplayName[] = [];

  const addBodyAreas = (muscleGroups: MuscleGroupDisplayName[]) => {
    for (const mg of muscleGroups) {
      const bodyArea = muscleGroupToBodyArea[mg];
      if (!seen.has(bodyArea)) {
        seen.add(bodyArea);
        result.push(bodyArea);
      }
    }
  };

  addBodyAreas(primaryMuscleGroups);
  addBodyAreas(secondaryMuscleGroups);
  addBodyAreas(tertiaryMuscleGroups);

  return result;
}
