const MAX_BAR_WIDTH_PERCENT = 90;

export function calculateRelativeBarWidth(percentage: number, maxPercentage: number): number {
  if (maxPercentage <= 0) return 0;
  return (percentage / maxPercentage) * MAX_BAR_WIDTH_PERCENT;
}
