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
          weightKg: Number(latestBodyWeight.weightKg),
        }
      : null,
  };
}
