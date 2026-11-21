const FIXED_ROUTINE_ORDER = ['Upper body', 'Lower body', 'Core'];

export function compareByFixedRoutineOrder(labelA: string, labelB: string): number {
  const aOrder = FIXED_ROUTINE_ORDER.indexOf(labelA);
  const bOrder = FIXED_ROUTINE_ORDER.indexOf(labelB);
  if (aOrder === -1 && bOrder === -1) return 0;
  if (aOrder === -1) return 1;
  if (bOrder === -1) return -1;
  return aOrder - bOrder;
}
