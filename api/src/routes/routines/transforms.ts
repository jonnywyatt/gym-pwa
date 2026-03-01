import type { Exercise, RoutineDetail, RoutineSummary } from '../../types';
import { muscleGroupDisplayNames } from '../../utils/display-names';
import type { RoutineWithExerciseCount, RoutineWithExercises } from './queries';

export function transformRoutineSummaries(routines: RoutineWithExerciseCount[]): RoutineSummary[] {
  return routines.map((routine) => ({
    id: routine.id,
    label: routine.label ?? '',
    userId: routine.userId,
    exerciseCount: routine._count.routineExercises,
  }));
}

export function transformRoutineDetail(routine: RoutineWithExercises): RoutineDetail {
  const exercises: Exercise[] = routine.routineExercises.map((re) => ({
    id: re.exercise.id,
    label: re.exercise.label,
    recordSetsType: re.exercise.recordSetsType,
    primaryMuscleGroups: re.exercise.primaryMuscleGroups.map(
      (pmg) => muscleGroupDisplayNames[pmg.muscleGroup.label]
    ),
    secondaryMuscleGroups: re.exercise.secondaryMuscleGroups.map(
      (smg) => muscleGroupDisplayNames[smg.muscleGroup.label]
    ),
  }));

  return {
    id: routine.id,
    label: routine.label ?? '',
    exercises,
  };
}
