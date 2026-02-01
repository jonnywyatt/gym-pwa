import type { BodyArea } from '../../src/prisma-client';
import { BodyAreaLabel } from '../../src/prisma-client';

type BodyAreaSeed = Pick<BodyArea, 'label'>;

export const bodyAreas: BodyAreaSeed[] = [
  { label: BodyAreaLabel.CHEST },
  { label: BodyAreaLabel.BACK },
  { label: BodyAreaLabel.SHOULDERS },
  { label: BodyAreaLabel.ARMS },
  { label: BodyAreaLabel.CORE },
  { label: BodyAreaLabel.LEGS },
];
