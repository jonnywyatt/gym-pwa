import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/vue';
import type { CreateWorkoutRequest } from 'gym-pwa-api/types';
import { HttpResponse, http } from 'msw';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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

let mockWorkoutId = 'test-workout-id';

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
  useRoute: () => ({
    params: { workoutId: mockWorkoutId },
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

describe('WorkoutPage', () => {
  const mockApiUrl = 'http://localhost:3000';

  beforeEach(async () => {
    localStorage.setItem('access_token', 'test-token');
    localStorage.setItem('user_id', '123');
    mockRouterPush.mockClear();
    mockWorkoutId = 'test-workout-id';
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
      expect(screen.getByText('Test Routine')).toBeInTheDocument();
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

  it('should show Start buttons for exercises', async () => {
    await db.workouts.add(createTestWorkout());

    render(WorkoutPage);

    await waitFor(() => {
      expect(screen.getByText('Bench Press')).toBeInTheDocument();
    });

    const startButtons = screen.getAllByText('Start');
    expect(startButtons).toHaveLength(2);
  });

  it('should start exercise and show sets when Start is clicked', async () => {
    const user = userEvent.setup();
    await db.workouts.add(createTestWorkout());

    render(WorkoutPage);

    await waitFor(() => {
      expect(screen.getByText('Bench Press')).toBeInTheDocument();
    });

    const startButtons = screen.getAllByText('Start');
    await user.click(startButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('W')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    expect(screen.getByText('Add Set')).toBeInTheDocument();
    expect(screen.getAllByText('Finish')).toHaveLength(2);
    expect(screen.getByText('Discard')).toBeInTheDocument();
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
      expect(screen.getByText('Add Set')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Add Set'));

    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });

  it('should finish exercise and show total weight', async () => {
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
              { id: 's1', setType: 'Warmup', weightKg: 40, reps: 10, completed: true },
              { id: 's2', setType: 'Standard', weightKg: 60, reps: 10, completed: true },
            ],
          },
        ],
      })
    );

    render(WorkoutPage);

    await waitFor(() => {
      const finishButtons = screen.getAllByText('Finish');
      expect(finishButtons).toHaveLength(2);
    });

    // Click the exercise Finish button (second one — inside ExerciseSets)
    const finishButtons = screen.getAllByText('Finish');
    await user.click(finishButtons[1]);

    await waitFor(() => {
      expect(screen.getByText('2 sets completed')).toBeInTheDocument();
    });

    // 1000 Kg appears in both exercise summary and navbar
    const weightTexts = screen.getAllByText('1000 Kg');
    expect(weightTexts.length).toBeGreaterThanOrEqual(1);
  });

  it('should discard exercise and return to Start state', async () => {
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
      expect(screen.getByText('Discard')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Discard'));

    await waitFor(() => {
      const startButtons = screen.getAllByText('Start');
      expect(startButtons).toHaveLength(1);
    });

    expect(screen.queryByText('Add Set')).not.toBeInTheDocument();
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
            totalWeightKg: 600,
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
      // 600 Kg appears in both navbar and the exercise completed summary
      const weightTexts = screen.getAllByText('600 Kg');
      expect(weightTexts.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('should save workout with sets and totalWeight when finished', async () => {
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
            totalWeightKg: 600,
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
      // The workout Finish button (not exercise one since exercise is already completed)
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
      expect(savedWorkout.exercisesCompleted[0].totalWeightKg).toBe(600);
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
            totalWeightKg: 600,
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
      expect(mockRouterPush).toHaveBeenCalledWith('/workouts');
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
            totalWeightKg: 600,
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
            totalWeightKg: 600,
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

  describe('summary mode', () => {
    beforeEach(() => {
      mockWorkoutId = '42';
    });

    it('should display workout summary when no active workout in IndexedDB', async () => {
      server.use(
        http.get(`${mockApiUrl}/users/123/workouts/42`, () => {
          return HttpResponse.json({
            id: 42,
            userId: 123,
            routineId: 1,
            routineLabel: 'Strength Training',
            startedAt: '2025-01-15T14:00:00.000Z',
            finishedAt: '2025-01-15T15:05:30.000Z',
            durationSeconds: 3930,
            exercisesCompleted: [
              {
                id: 1,
                label: 'Bench Press',
                recordSetsType: 'WEIGHT',
                primaryMuscleGroups: ['Pectoralis Major'],
                secondaryMuscleGroups: ['Triceps'],
                sets: [
                  { setType: 'Warmup', weightKg: 40, reps: 10 },
                  { setType: 'Standard', weightKg: 60, reps: 10 },
                ],
                totalWeightKg: 1000,
              },
            ],
            totalWeightKg: 1000,
            bodyWeightKg: 75.5,
          });
        })
      );

      render(WorkoutPage);

      await waitFor(() => {
        expect(screen.getByText('Strength Training')).toBeInTheDocument();
      });

      expect(screen.getByText('1h 5m 30s')).toBeInTheDocument();
      expect(screen.getByText('1,000kg total')).toBeInTheDocument();
      expect(screen.getByText('Bench Press')).toBeInTheDocument();
      expect(screen.getByText('1,000kg')).toBeInTheDocument();
      expect(screen.getByText('Warmup · 40kg · 10 reps')).toBeInTheDocument();
      expect(screen.getByText('Standard · 60kg · 10 reps')).toBeInTheDocument();
    });

    it('should display exercises with different record set types', async () => {
      server.use(
        http.get(`${mockApiUrl}/users/123/workouts/42`, () => {
          return HttpResponse.json({
            id: 42,
            userId: 123,
            routineId: 1,
            routineLabel: 'Mixed Workout',
            startedAt: '2025-01-15T14:00:00.000Z',
            finishedAt: '2025-01-15T15:00:00.000Z',
            durationSeconds: 3600,
            exercisesCompleted: [
              {
                id: 1,
                label: 'Plank',
                recordSetsType: 'TIME',
                primaryMuscleGroups: ['Core'],
                secondaryMuscleGroups: [],
                sets: [{ setType: 'Standard', timeSeconds: 60 }],
                totalWeightKg: 0,
              },
              {
                id: 2,
                label: 'Assisted Pull-up',
                recordSetsType: 'BODYWEIGHT_MINUS_OFFSET',
                primaryMuscleGroups: ['Back'],
                secondaryMuscleGroups: [],
                sets: [{ setType: 'Standard', weightKg: 20, reps: 8 }],
                totalWeightKg: 480,
              },
            ],
            totalWeightKg: 480,
            bodyWeightKg: 80,
          });
        })
      );

      render(WorkoutPage);

      await waitFor(() => {
        expect(screen.getByText('Mixed Workout')).toBeInTheDocument();
      });

      expect(screen.getByText('Standard · 1m')).toBeInTheDocument();
      expect(screen.getByText('Standard · 20kg offset · 8 reps')).toBeInTheDocument();
    });

    it('should display error when API fetch fails', async () => {
      server.use(
        http.get(`${mockApiUrl}/users/123/workouts/42`, () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      render(WorkoutPage);

      await waitFor(() => {
        expect(screen.getByText(/Error:/)).toBeInTheDocument();
      });
    });

    it('should not show active workout UI elements in summary mode', async () => {
      server.use(
        http.get(`${mockApiUrl}/users/123/workouts/42`, () => {
          return HttpResponse.json({
            id: 42,
            userId: 123,
            routineId: 1,
            routineLabel: 'Test Workout',
            startedAt: '2025-01-15T14:00:00.000Z',
            finishedAt: '2025-01-15T15:00:00.000Z',
            durationSeconds: 3600,
            exercisesCompleted: [],
            totalWeightKg: 0,
            bodyWeightKg: 75,
          });
        })
      );

      render(WorkoutPage);

      await waitFor(() => {
        expect(screen.getByText('Test Workout')).toBeInTheDocument();
      });

      expect(screen.queryByText('Finish')).not.toBeInTheDocument();
      expect(screen.queryByText('Finishing...')).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Pause' })).not.toBeInTheDocument();
    });
  });
});
