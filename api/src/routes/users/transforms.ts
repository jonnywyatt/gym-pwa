import type { User, UserBodyWeight } from '../../prisma-client';
import type { UserProfile } from '../../types';

export function transformUserProfile(
  user: User,
  latestBodyWeight: UserBodyWeight | null
): UserProfile {
  return {
    id: user.id,
    name: user.name,
    latestBodyWeight: latestBodyWeight
      ? {
          weight: Number(latestBodyWeight.weight),
          unit: latestBodyWeight.unit,
        }
      : null,
  };
}
