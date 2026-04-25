import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/vue';
import type { CompletedWorkoutExercise } from 'gym-pwa-api/types';
import { describe, expect, it } from 'vitest';
import ExerciseSummary from './ExerciseSummary.vue';

const baseExercise: CompletedWorkoutExercise = {
  id: 1,
  label: 'Bench Press',
  recordSetsType: 'WEIGHT',
  isIsometric: false,
  isUnilateral: false,
  bwFactor: null,
  primaryMuscleGroups: ['Pectoralis Major'],
  secondaryMuscleGroups: ['Triceps'],
  tertiaryMuscleGroups: [],
  sets: [
    { setType: 'Warmup', weightKg: 40, reps: 10 },
    { setType: 'Standard', weightKg: 60, reps: 8 },
  ],
};

describe('ExerciseSummary', () => {
  it('renders exercise label as a button', () => {
    render(ExerciseSummary, {
      props: { exercise: baseExercise, bodyWeightKg: 75 },
    });

    expect(screen.getByRole('button', { name: /Bench Press/ })).toBeInTheDocument();
  });

  it('shows total weight in the header', () => {
    render(ExerciseSummary, {
      props: { exercise: baseExercise, bodyWeightKg: 75 },
    });

    // 40*10 + 60*8 = 400 + 480 = 880kg
    expect(
      screen.getByText(
        (_, el) =>
          el?.tagName === 'SPAN' &&
          el?.childNodes[0]?.nodeValue === '880' &&
          el?.childNodes[1]?.textContent === 'kg'
      )
    ).toBeInTheDocument();
  });

  it('does not show set details when collapsed', () => {
    render(ExerciseSummary, {
      props: { exercise: baseExercise, bodyWeightKg: 75 },
    });

    expect(screen.queryByText('Warmup · 40kg · 10 reps')).not.toBeInTheDocument();
  });

  it('reveals set details when expanded', async () => {
    const user = userEvent.setup();

    render(ExerciseSummary, {
      props: { exercise: baseExercise, bodyWeightKg: 75 },
    });

    await user.click(screen.getByRole('button', { name: /Bench Press/ }));

    expect(screen.getByText('Warmup · 40kg · 10 reps')).toBeInTheDocument();
    expect(screen.getByText('Standard · 60kg · 8 reps')).toBeInTheDocument();
  });

  it('collapses set details on second click', async () => {
    const user = userEvent.setup();

    render(ExerciseSummary, {
      props: { exercise: baseExercise, bodyWeightKg: 75 },
    });

    await user.click(screen.getByRole('button', { name: /Bench Press/ }));
    expect(screen.getByText('Warmup · 40kg · 10 reps')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Bench Press/ }));
    expect(screen.queryByText('Warmup · 40kg · 10 reps')).not.toBeInTheDocument();
  });

  it('includes bwFactor contribution in header total weight', () => {
    const reverseLunge: CompletedWorkoutExercise = {
      ...baseExercise,
      label: 'Reverse Lunge',
      bwFactor: 0.5,
      sets: [{ setType: 'Standard', weightKg: 10, reps: 10 }],
    };

    render(ExerciseSummary, {
      props: { exercise: reverseLunge, bodyWeightKg: 80 },
    });

    // (10kg added + 80 * 0.5 bw contribution) * 10 reps = (10 + 40) * 10 = 500kg
    expect(
      screen.getByText(
        (_, el) =>
          el?.tagName === 'SPAN' &&
          el?.childNodes[0]?.nodeValue === '500' &&
          el?.childNodes[1]?.textContent === 'kg'
      )
    ).toBeInTheDocument();
  });

  it('does not show total weight when there is none', () => {
    const repsExercise: CompletedWorkoutExercise = {
      ...baseExercise,
      label: 'Plank',
      recordSetsType: 'TIME',
      sets: [{ setType: 'Standard', timeSeconds: 60 }],
    };

    render(ExerciseSummary, {
      props: { exercise: repsExercise, bodyWeightKg: 75 },
    });

    expect(screen.queryByText(/kg/)).not.toBeInTheDocument();
  });

  it('shows total time in the header for TIME exercises', () => {
    const deadHang: CompletedWorkoutExercise = {
      ...baseExercise,
      label: 'Dead Hang',
      recordSetsType: 'TIME',
      sets: [
        { setType: 'Standard', timeSeconds: 60 },
        { setType: 'Standard', timeSeconds: 30 },
      ],
    };

    render(ExerciseSummary, {
      props: { exercise: deadHang, bodyWeightKg: 75 },
    });

    expect(screen.getByText('1m 30s')).toBeInTheDocument();
  });

  it('shows total time alongside weight for WEIGHT_AND_TIME exercises', () => {
    const farmersCarry: CompletedWorkoutExercise = {
      ...baseExercise,
      label: "Farmer's Carry",
      recordSetsType: 'WEIGHT_AND_TIME',
      sets: [
        { setType: 'Standard', weightKg: 20, timeSeconds: 45 },
        { setType: 'Standard', weightKg: 20, timeSeconds: 45 },
      ],
    };

    render(ExerciseSummary, {
      props: { exercise: farmersCarry, bodyWeightKg: 75 },
    });

    expect(screen.getByText('1m 30s')).toBeInTheDocument();
    expect(
      screen.getByText(
        (_, el) =>
          el?.tagName === 'SPAN' &&
          el?.childNodes[0]?.nodeValue === '40' &&
          el?.childNodes[1]?.textContent === 'kg'
      )
    ).toBeInTheDocument();
  });

  it('does not show time when no sets have time recorded', () => {
    render(ExerciseSummary, {
      props: { exercise: baseExercise, bodyWeightKg: 75 },
    });

    expect(screen.queryByText(/\d+s/)).not.toBeInTheDocument();
    expect(screen.queryByText(/\d+m/)).not.toBeInTheDocument();
  });
});
