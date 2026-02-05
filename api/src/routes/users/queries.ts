import { WeightUnit } from '../../prisma-client';
import { prisma } from '../../utils/prisma';

export async function getUserById(userId: number) {
  return await prisma.user.findUnique({
    where: { id: userId },
  });
}

export async function getLatestBodyWeight(userId: number) {
  return await prisma.userBodyWeight.findFirst({
    where: { userId },
    orderBy: { recordedAt: 'desc' },
  });
}

export async function createBodyWeight(userId: number, weight: number) {
  return await prisma.userBodyWeight.create({
    data: {
      userId,
      weight,
      unit: WeightUnit.KG,
    },
  });
}
