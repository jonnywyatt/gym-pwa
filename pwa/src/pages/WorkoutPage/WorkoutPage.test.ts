import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/vue';
import type { CreateWorkoutRequest } from 'gym-pwa-api/types';
import { HttpResponse, http } from 'msw';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import type { LocalWorkout } from '../../lib/db';
import { db } from '../../lib/db';
import { server } from '../../test/msw';
import WorkoutPage from './WorkoutPage.vue';

vi.mock('../../config', () => ({
  config: {
    apiUrl: 'http://localhost:3000',
    googleClientId: 'test-client-id',
  },
}));

const mockRouterPush = vi.fn();

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
  useRoute: () => ({
    params: { workoutId: 'test-workout-id' },
  }),
}));

function createTestWorkout(overrides: Partial<LocalWorkout> = {}): LocalWorkout {
  return {
    id: 'test-workout-id',
    userId: 123,
    routineId: 1,
    routineLabel: 'Test Routine',
    startedAt: '2025-01-15T14:00:00.000Z',
    bodyWeightKg: 75.5,
    exercisesCompleted: [
      {
        id: 1,
        label: 'Bench Press',
        recordSetsType: 'WEIGHT',
        primaryMuscleGroups: ['Pectoralis Major'],
        secondaryMuscleGroups: ['Triceps'],
        completed: false,
      },
      {
        id: 2,
        label: 'Squats',
        recordSetsType: 'WEIGHT',
        primaryMuscleGroups: ['Quadriceps'],
        secondaryMuscleGroups: ['Glutes'],
        completed: false,
      },
    ],
    ...overrides,
  };
}

const mockApiUrl = 'http://localhost:3000';

beforeEach(async () => {
  localStorage.setItem('access_token', 'test-token');
  localStorage.setItem('user_id', '123');
  mockRouterPush.mockClear();
  await db.workouts.clear();
});

afterEach(async () => {
  vi.useRealTimers();
  await db.workouts.clear();
});

it('should display loading state initially', () => {
  render(WorkoutPage);
  expect(screen.getByText('Loading...')).toBeInTheDocument();
});

it('should display workout with exercises', async () => {
  await db.workouts.add(createTestWorkout());

  render(WorkoutPage);

  await waitFor(() => {
    expect(screen.getByText('Test Routine session')).toBeInTheDocument();
  });

  expect(screen.getByText('Bench Press')).toBeInTheDocument();
  expect(screen.getByText('Squats')).toBeInTheDocument();
});

it('should display error when workout not found', async () => {
  render(WorkoutPage);

  await waitFor(() => {
    expect(screen.getByText('Error: Workout not found')).toBeInTheDocument();
  });
});

it('should show exercise rows with chevrons', async () => {
  await db.workouts.add(createTestWorkout());

  render(WorkoutPage);

  await waitFor(() => {
    expect(screen.getByText('Bench Press')).toBeInTheDocument();
  });

  expect(screen.getByRole('button', { name: /bench press/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /squats/i })).toBeInTheDocument();
});

it('should open panel and show sets when exercise row is clicked', async () => {
  const user = userEvent.setup();
  await db.workouts.add(createTestWorkout());

  render(WorkoutPage);

  await waitFor(() => {
    expect(screen.getByText('Bench Press')).toBeInTheDocument();
  });

  await user.click(screen.getByRole('button', { name: /bench press/i }));

  await waitFor(() => {
    expect(screen.getByRole('button', { name: 'Add Set' })).toBeInTheDocument();
  });

  expect(screen.getAllByPlaceholderText('Kg').length).toBeGreaterThanOrEqual(1);
  expect(screen.getAllByPlaceholderText('Reps').length).toBeGreaterThanOrEqual(1);
});

it('should add a new set when Add Set is clicked', async () => {
  const user = userEvent.setup();
  await db.workouts.add(
    createTestWorkout({
      exercisesCompleted: [
        {
          id: 1,
          label: 'Bench Press',
          recordSetsType: 'WEIGHT',
          primaryMuscleGroups: ['Pectoralis Major'],
          secondaryMuscleGroups: ['Triceps'],
          completed: false,
          startedAt: '2025-01-15T14:00:00.000Z',
          sets: [
            { id: 's1', setType: 'Warmup', completed: false },
            { id: 's2', setType: 'Standard', completed: false },
          ],
        },
      ],
    })
  );

  render(WorkoutPage);

  await waitFor(() => {
    expect(screen.getByText('Bench Press')).toBeInTheDocument();
  });

  await user.click(screen.getByRole('button', { name: /bench press/i }));

  await waitFor(() => {
    expect(screen.getByRole('button', { name: 'Add Set' })).toBeInTheDocument();
  });

  await user.click(screen.getByRole('button', { name: 'Add Set' }));

  await waitFor(() => {
    expect(screen.getAllByPlaceholderText('Kg')).toHaveLength(3);
  });
});

it('should show exercise total weight when sets are completed', async () => {
  await db.workouts.add(
    createTestWorkout({
      exercisesCompleted: [
        {
          id: 1,
          label: 'Bench Press',
          recordSetsType: 'WEIGHT',
          primaryMuscleGroups: ['Pectoralis Major'],
          secondaryMuscleGroups: ['Triceps'],
          completed: false,
          startedAt: '2025-01-15T14:00:00.000Z',
          sets: [
            { id: 's1', setType: 'Warmup', weightKg: 40, reps: 10, completed: true },
            { id: 's2', setType: 'Standard', weightKg: 60, reps: 10, completed: true },
          ],
        },
      ],
    })
  );

  render(WorkoutPage);

  await waitFor(() => {
    expect(
      screen.getAllByText((_, el) => el?.tagName === 'SPAN' && el?.textContent === '1000kg').length
    ).toBeGreaterThanOrEqual(1);
  });
});

it('should close the panel when exercise row is clicked again', async () => {
  const user = userEvent.setup();
  await db.workouts.add(
    createTestWorkout({
      exercisesCompleted: [
        {
          id: 1,
          label: 'Bench Press',
          recordSetsType: 'WEIGHT',
          primaryMuscleGroups: ['Pectoralis Major'],
          secondaryMuscleGroups: ['Triceps'],
          completed: false,
          startedAt: '2025-01-15T14:00:00.000Z',
          sets: [
            { id: 's1', setType: 'Warmup', completed: false },
            { id: 's2', setType: 'Standard', completed: false },
          ],
        },
      ],
    })
  );

  render(WorkoutPage);

  await waitFor(() => {
    expect(screen.getByText('Bench Press')).toBeInTheDocument();
  });

  const exerciseRow = screen.getByRole('button', { name: /bench press/i });
  await user.click(exerciseRow);

  await waitFor(() => {
    expect(screen.getByRole('button', { name: 'Add Set' })).toBeInTheDocument();
  });

  await user.click(exerciseRow);

  await waitFor(() => {
    expect(screen.queryByRole('button', { name: 'Add Set' })).not.toBeInTheDocument();
  });
});

it('should show workout total weight in navbar when exercises are finished', async () => {
  await db.workouts.add(
    createTestWorkout({
      exercisesCompleted: [
        {
          id: 1,
          label: 'Bench Press',
          recordSetsType: 'WEIGHT',
          primaryMuscleGroups: ['Pectoralis Major'],
          secondaryMuscleGroups: ['Triceps'],
          completed: true,
          sets: [{ id: 's1', setType: 'Standard', weightKg: 60, reps: 10, completed: true }],
        },
        {
          id: 2,
          label: 'Squats',
          recordSetsType: 'WEIGHT',
          primaryMuscleGroups: ['Quadriceps'],
          secondaryMuscleGroups: ['Glutes'],
          completed: false,
        },
      ],
    })
  );

  render(WorkoutPage);

  await waitFor(() => {
    // 600kg appears in both navbar and the exercise completed summary
    const weightTexts = screen.getAllByText(
      (_, el) => el?.tagName === 'SPAN' && el?.textContent === '600kg'
    );
    expect(weightTexts.length).toBeGreaterThanOrEqual(2);
  });
});

it('should save workout with sets when finished', async () => {
  const user = userEvent.setup();

  await db.workouts.add(
    createTestWorkout({
      exercisesCompleted: [
        {
          id: 1,
          label: 'Bench Press',
          recordSetsType: 'WEIGHT',
          primaryMuscleGroups: ['Pectoralis Major'],
          secondaryMuscleGroups: ['Triceps'],
          completed: true,
          sets: [{ id: 's1', setType: 'Standard', weightKg: 60, reps: 10, completed: true }],
        },
      ],
    })
  );

  let savedWorkout: CreateWorkoutRequest | null = null;

  server.use(
    http.post(`${mockApiUrl}/users/123/workouts`, async ({ request }) => {
      savedWorkout = (await request.json()) as CreateWorkoutRequest;
      return HttpResponse.json({
        id: 1,
        userId: 123,
        ...savedWorkout,
      });
    })
  );

  render(WorkoutPage);

  await waitFor(() => {
    expect(screen.getByText('Finish')).toBeInTheDocument();
  });

  await user.click(screen.getByText('Finish'));

  await waitFor(() => {
    if (savedWorkout === null) {
      throw new Error('savedWorkout should not be null');
    }
    expect(savedWorkout.totalWeightKg).toBe(600);
    expect(savedWorkout.exercisesCompleted).toHaveLength(1);
    expect(savedWorkout.exercisesCompleted[0].sets).toHaveLength(1);
    expect(savedWorkout.exercisesCompleted[0].sets[0].setType).toBe('Standard');
    expect(savedWorkout.exercisesCompleted[0].sets[0].weightKg).toBe(60);
    expect(savedWorkout.exercisesCompleted[0].sets[0].reps).toBe(10);
    expect(savedWorkout.bodyWeightKg).toBe(75.5);
  });
});

it('should remove workout from IndexedDB after successful save', async () => {
  const user = userEvent.setup();

  await db.workouts.add(
    createTestWorkout({
      exercisesCompleted: [
        {
          id: 1,
          label: 'Bench Press',
          recordSetsType: 'WEIGHT',
          primaryMuscleGroups: ['Pectoralis Major'],
          secondaryMuscleGroups: ['Triceps'],
          completed: true,
          sets: [{ id: 's1', setType: 'Standard', weightKg: 60, reps: 10, completed: true }],
        },
      ],
    })
  );

  server.use(
    http.post(`${mockApiUrl}/users/123/workouts`, () => {
      return HttpResponse.json({
        id: 1,
        userId: 123,
        routineId: 1,
        routineLabel: 'Test Routine',
        startedAt: '2025-01-15T14:00:00.000Z',
        finishedAt: '2025-01-15T15:00:00.000Z',
        exercisesCompleted: [],
      });
    })
  );

  render(WorkoutPage);

  await waitFor(() => {
    expect(screen.getByText('Finish')).toBeInTheDocument();
  });

  const workoutBefore = await db.workouts.get('test-workout-id');
  expect(workoutBefore).toBeDefined();

  await user.click(screen.getByText('Finish'));

  await waitFor(() => {
    expect(mockRouterPush).toHaveBeenCalledWith('/sessions');
  });

  const workoutAfter = await db.workouts.get('test-workout-id');
  expect(workoutAfter).toBeUndefined();
});

it('should display error when save fails', async () => {
  const user = userEvent.setup();

  await db.workouts.add(
    createTestWorkout({
      exercisesCompleted: [
        {
          id: 1,
          label: 'Bench Press',
          recordSetsType: 'WEIGHT',
          primaryMuscleGroups: ['Pectoralis Major'],
          secondaryMuscleGroups: ['Triceps'],
          completed: true,
          sets: [{ id: 's1', setType: 'Standard', weightKg: 60, reps: 10, completed: true }],
        },
      ],
    })
  );

  server.use(
    http.post(`${mockApiUrl}/users/123/workouts`, () => {
      return new HttpResponse(null, { status: 500 });
    })
  );

  render(WorkoutPage);

  await waitFor(() => {
    expect(screen.getByText('Finish')).toBeInTheDocument();
  });

  await user.click(screen.getByText('Finish'));

  await waitFor(() => {
    expect(screen.getByText(/Error:/)).toBeInTheDocument();
  });

  const workout = await db.workouts.get('test-workout-id');
  expect(workout).toBeDefined();
});

it('should display workout timer', async () => {
  await db.workouts.add(
    createTestWorkout({
      startedAt: new Date(Date.now() - 300000).toISOString(),
    })
  );

  render(WorkoutPage);

  await waitFor(() => {
    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument();
  });

  const timerText = screen.getByText(/\d{2}:\d{2}:\d{2}/);
  expect(timerText).toBeInTheDocument();
});

it('should pause and resume timer', async () => {
  const user = userEvent.setup();

  await db.workouts.add(
    createTestWorkout({
      startedAt: new Date(Date.now() - 300000).toISOString(),
    })
  );

  render(WorkoutPage);

  await waitFor(() => {
    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument();
  });

  const pauseButton = screen.getByRole('button', { name: 'Pause' });
  await user.click(pauseButton);

  await waitFor(() => {
    expect(screen.getByRole('button', { name: 'Resume' })).toBeInTheDocument();
  });

  const workoutAfterPause = await db.workouts.get('test-workout-id');
  if (workoutAfterPause === null || workoutAfterPause === undefined) {
    throw new Error('Workout should exist after pause');
  }
  expect(workoutAfterPause.pausedAt).toBeDefined();

  await new Promise((resolve) => setTimeout(resolve, 100));

  const resumeButton = screen.getByRole('button', { name: 'Resume' });
  await user.click(resumeButton);

  await waitFor(() => {
    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument();
  });

  const workoutAfterResume = await db.workouts.get('test-workout-id');
  if (workoutAfterResume === null || workoutAfterResume === undefined) {
    throw new Error('Workout should exist after resume');
  }
  expect(workoutAfterResume.pausedAt).toBeUndefined();
  expect(workoutAfterResume.totalPausedSeconds).toBeGreaterThanOrEqual(0);
});

it('should save durationSeconds when finishing workout', async () => {
  const user = userEvent.setup();

  const startedAt = new Date(Date.now() - 1800000).toISOString();

  await db.workouts.add(
    createTestWorkout({
      startedAt,
      totalPausedSeconds: 300,
      exercisesCompleted: [
        {
          id: 1,
          label: 'Bench Press',
          recordSetsType: 'WEIGHT',
          primaryMuscleGroups: ['Pectoralis Major'],
          secondaryMuscleGroups: ['Triceps'],
          completed: true,
          sets: [{ id: 's1', setType: 'Standard', weightKg: 60, reps: 10, completed: true }],
        },
      ],
    })
  );

  let savedWorkout: CreateWorkoutRequest | null = null;

  server.use(
    http.post(`${mockApiUrl}/users/123/workouts`, async ({ request }) => {
      savedWorkout = (await request.json()) as CreateWorkoutRequest;
      return HttpResponse.json({
        id: 1,
        userId: 123,
        ...savedWorkout,
      });
    })
  );

  render(WorkoutPage);

  await waitFor(() => {
    expect(screen.getByText('Finish')).toBeInTheDocument();
  });

  await user.click(screen.getByText('Finish'));

  await waitFor(() => {
    if (savedWorkout === null) {
      throw new Error('savedWorkout should not be null');
    }
    expect(savedWorkout.durationSeconds).toBeGreaterThan(1400);
    expect(savedWorkout.durationSeconds).toBeLessThan(1600);
  });
});

it('should not display delete button', async () => {
  await db.workouts.add(createTestWorkout());

  render(WorkoutPage);

  await waitFor(() => {
    expect(screen.getByText('Test Routine session')).toBeInTheDocument();
  });

  expect(screen.queryByRole('button', { name: 'Delete session' })).not.toBeInTheDocument();
});
