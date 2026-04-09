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
    isIsometric: re.exercise.isIsometric,
    isUnilateral: re.exercise.isUnilateral,
    bwFactor: re.exercise.bwFactor !== null ? Number(re.exercise.bwFactor) : null,
    primaryMuscleGroups: re.exercise.primaryMuscleGroups.map(
      (pmg) => muscleGroupDisplayNames[pmg.muscleGroup.label]
    ),
    secondaryMuscleGroups: re.exercise.secondaryMuscleGroups.map(
      (smg) => muscleGroupDisplayNames[smg.muscleGroup.label]
    ),
    tertiaryMuscleGroups: re.exercise.tertiaryMuscleGroups.map(
      (tmg) => muscleGroupDisplayNames[tmg.muscleGroup.label]
    ),
  }));

  return {
    id: routine.id,
    label: routine.label ?? '',
    userId: routine.userId,
    exercises,
  };
}
