import type { BodyAreaDisplayName, MuscleGroupDisplayName } from 'gym-pwa-api/types';

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
