import type { UserPreferences } from '../../types';
import { prisma } from '../../utils/prisma';

export async function getUserById(userId: number) {
  return await prisma.user.findUnique({
    where: { id: userId },
  });
}

export async function getUserPreferences(userId: number): Promise<UserPreferences> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const prefs = user?.preferences;
  if (prefs && typeof prefs === 'object' && !Array.isArray(prefs)) {
    const showRecommendedRoutines =
      'showRecommendedRoutines' in prefs && typeof prefs.showRecommendedRoutines === 'boolean'
        ? prefs.showRecommendedRoutines
        : true;
    return { showRecommendedRoutines };
  }
  return { showRecommendedRoutines: true };
}

export async function updateUserPreferences(
  userId: number,
  update: Partial<UserPreferences>
): Promise<UserPreferences> {
  const current = await getUserPreferences(userId);
  const merged = { ...current, ...update };
  await prisma.user.update({
    where: { id: userId },
    data: { preferences: merged },
  });
  return merged;
}

export async function getLatestBodyWeight(userId: number) {
  return await prisma.userBodyWeight.findFirst({
    where: { userId },
    orderBy: { recordedAt: 'desc' },
  });
}

export async function createBodyWeight(userId: number, weightKg: number) {
  return await prisma.userBodyWeight.create({
    data: {
      userId,
      weightKg,
    },
  });
}
