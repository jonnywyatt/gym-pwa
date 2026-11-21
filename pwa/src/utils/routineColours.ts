const FIXED_ROUTINE_COLOURS: Record<string, string> = {
  'Upper body': 'var(--em-accent-teal)',
  'Lower body': 'var(--em-accent-emerald)',
  Core: 'var(--em-accent-aqua)',
};

export function getFixedRoutineColour(label: string): string | undefined {
  return FIXED_ROUTINE_COLOURS[label];
}
