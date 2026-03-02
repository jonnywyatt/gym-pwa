import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/vue';
import type { CreateWorkoutRequest } from 'gym-pwa-api/types';
import { HttpResponse, http } from 'msw';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { LocalWorkout } from '../../lib/db';
import { db } from '../../lib/db';
import { server } from '../../test/msw';
import WorkoutPage from './WorkoutPage.vue';

HTMLDialogElement.prototype.showModal = function () {
  this.setAttribute('open', '');
};

HTMLDialogElement.prototype.close = function () {
  this.removeAttribute('open');
};

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
      expect(screen.getByText('Test Routine workout')).toBeInTheDocument();
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
        screen.getByText((_, el) => el?.tagName === 'SPAN' && el?.textContent === '1000kg')
      ).toBeInTheDocument();
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
              },
            ],
            totalWeightKg: 1000,
            bodyWeightKg: 75.5,
          });
        })
      );

      render(WorkoutPage);

      await waitFor(() => {
        expect(screen.getByText('Strength Training workout')).toBeInTheDocument();
      });

      expect(screen.getByText('1h 5m 30s')).toBeInTheDocument();
      expect(screen.getByText('1,000kg total')).toBeInTheDocument();
      expect(screen.getByText('Bench Press')).toBeInTheDocument();
      expect(screen.getByText('1,000kg')).toBeInTheDocument();
      expect(screen.getByText('Warmup · 40kg · 10 reps')).toBeInTheDocument();
      expect(screen.getByText('Standard · 60kg · 10 reps')).toBeInTheDocument();
    });

    it('should display bodyweight in summary', async () => {
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
            bodyWeightKg: 80,
          });
        })
      );

      render(WorkoutPage);

      await waitFor(() => {
        expect(screen.getByText('Test Workout workout')).toBeInTheDocument();
      });

      expect(screen.getByText('Body weight: 80kg')).toBeInTheDocument();
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
              },
              {
                id: 2,
                label: 'Assisted Pull-up',
                recordSetsType: 'BODYWEIGHT_MINUS_OFFSET',
                primaryMuscleGroups: ['Back'],
                secondaryMuscleGroups: [],
                sets: [{ setType: 'Standard', weightKg: 20, reps: 8 }],
              },
            ],
            totalWeightKg: 480,
            bodyWeightKg: 80,
          });
        })
      );

      render(WorkoutPage);

      await waitFor(() => {
        expect(screen.getByText('Mixed Workout workout')).toBeInTheDocument();
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
        expect(screen.getByText('Test Workout workout')).toBeInTheDocument();
      });

      expect(screen.queryByText('Finish')).not.toBeInTheDocument();
      expect(screen.queryByText('Saving...')).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Pause' })).not.toBeInTheDocument();
    });

    it('should display delete button in summary mode', async () => {
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
        expect(screen.getByText('Test Workout workout')).toBeInTheDocument();
      });

      expect(screen.getByRole('button', { name: 'Delete workout' })).toBeInTheDocument();
    });

    it('should navigate to /workouts after confirming delete', async () => {
      const user = userEvent.setup();

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
        }),
        http.delete(`${mockApiUrl}/users/123/workouts/42`, () => {
          return new HttpResponse(null, { status: 204 });
        })
      );

      render(WorkoutPage);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Delete workout' })).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: 'Delete workout' }));

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Delete workout?' })).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: 'Delete' }));

      await waitFor(() => {
        expect(mockRouterPush).toHaveBeenCalledWith('/workouts');
      });
    });

    it('should display error when delete fails', async () => {
      const user = userEvent.setup();

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
        }),
        http.delete(`${mockApiUrl}/users/123/workouts/42`, () => {
          return HttpResponse.json({ error: 'Server error' }, { status: 500 });
        })
      );

      render(WorkoutPage);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Delete workout' })).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: 'Delete workout' }));
      await user.click(screen.getByRole('button', { name: 'Delete' }));

      await waitFor(() => {
        expect(screen.getByText(/Error:/)).toBeInTheDocument();
      });
    });
  });

  it('should not display delete button in active mode', async () => {
    await db.workouts.add(createTestWorkout());

    render(WorkoutPage);

    await waitFor(() => {
      expect(screen.getByText('Test Routine workout')).toBeInTheDocument();
    });

    expect(screen.queryByRole('button', { name: 'Delete workout' })).not.toBeInTheDocument();
  });
});
