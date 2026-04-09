import type { Exercise } from '../../types';
import { muscleGroupDisplayNames } from '../../utils/display-names';
import type { ExerciseWithMuscleGroups } from './queries';

export function transformExercises(exercises: ExerciseWithMuscleGroups[]): Exercise[] {
  return exercises.map((exercise) => ({
    id: exercise.id,
    label: exercise.label,
    recordSetsType: exercise.recordSetsType,
    isIsometric: exercise.isIsometric,
    isUnilateral: exercise.isUnilateral,
    bwFactor: exercise.bwFactor !== null ? Number(exercise.bwFactor) : null,
    primaryMuscleGroups: exercise.primaryMuscleGroups.map(
      (pmg) => muscleGroupDisplayNames[pmg.muscleGroup.label]
    ),
    secondaryMuscleGroups: exercise.secondaryMuscleGroups.map(
      (smg) => muscleGroupDisplayNames[smg.muscleGroup.label]
    ),
    tertiaryMuscleGroups: exercise.tertiaryMuscleGroups.map(
      (tmg) => muscleGroupDisplayNames[tmg.muscleGroup.label]
    ),
  }));
}
