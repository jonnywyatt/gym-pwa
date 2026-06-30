import { render } from '@testing-library/vue';
import { describe, expect, it } from 'vitest';
import MuscleMap from './MuscleMap.vue';

describe('MuscleMap', () => {
  it('renders front SVG for front-only muscles', () => {
    const { container } = render(MuscleMap, {
      props: {
        primaryMuscleGroups: ['Pectoralis Major'],
        secondaryMuscleGroups: [],
        tertiaryMuscleGroups: [],
      },
    });

    const svgs = container.querySelectorAll('svg');
    expect(svgs).toHaveLength(1);
    expect(container.querySelector('#chest')).toBeInTheDocument();
  });

  it('renders back SVG for back-only muscles', () => {
    const { container } = render(MuscleMap, {
      props: {
        primaryMuscleGroups: ['Latissimus Dorsi'],
        secondaryMuscleGroups: [],
        tertiaryMuscleGroups: [],
      },
    });

    const svgs = container.querySelectorAll('svg');
    expect(svgs).toHaveLength(1);
    expect(container.querySelector('#lats')).toBeInTheDocument();
  });

  it('renders both SVGs when muscles appear front and back', () => {
    const { container } = render(MuscleMap, {
      props: {
        primaryMuscleGroups: ['Pectoralis Major'],
        secondaryMuscleGroups: ['Latissimus Dorsi'],
        tertiaryMuscleGroups: [],
      },
    });

    expect(container.querySelectorAll('svg')).toHaveLength(2);
  });

  it('applies primary colour to primary muscle group regions', () => {
    const { container } = render(MuscleMap, {
      props: {
        primaryMuscleGroups: ['Pectoralis Major'],
        secondaryMuscleGroups: [],
        tertiaryMuscleGroups: [],
      },
    });

    const chestGroup = container.querySelector('#chest') as HTMLElement;
    expect(chestGroup.style.color).toBe('var(--muscle-primary)');
  });

  it('applies secondary colour to secondary muscle group regions', () => {
    const { container } = render(MuscleMap, {
      props: {
        primaryMuscleGroups: [],
        secondaryMuscleGroups: ['Biceps'],
        tertiaryMuscleGroups: [],
      },
    });

    const bicepsGroup = container.querySelector('#biceps') as HTMLElement;
    expect(bicepsGroup.style.color).toBe('var(--muscle-secondary)');
  });

  it('applies tertiary colour to tertiary muscle group regions', () => {
    const { container } = render(MuscleMap, {
      props: {
        primaryMuscleGroups: [],
        secondaryMuscleGroups: [],
        tertiaryMuscleGroups: ['Abdominals'],
      },
    });

    const abdominalsGroup = container.querySelector('#abdominals') as HTMLElement;
    expect(abdominalsGroup.style.color).toBe('var(--muscle-tertiary)');
  });

  it('applies default colour to unhighlighted regions', () => {
    const { container } = render(MuscleMap, {
      props: {
        primaryMuscleGroups: ['Pectoralis Major'],
        secondaryMuscleGroups: [],
        tertiaryMuscleGroups: [],
      },
    });

    const quadsGroup = container.querySelector('#quads') as HTMLElement;
    expect(quadsGroup.style.color).toBe('var(--background-surface-hover)');
  });

  it('renders no SVGs when no muscle groups provided', () => {
    const { container } = render(MuscleMap, {
      props: {
        primaryMuscleGroups: [],
        secondaryMuscleGroups: [],
        tertiaryMuscleGroups: [],
      },
    });

    expect(container.querySelectorAll('svg')).toHaveLength(0);
  });
});
