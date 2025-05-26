import { PrismaClient, Profile } from '@prisma/client';
import DataLoader from 'dataloader';

export const createProfileLoader = (prisma: PrismaClient) => {
  return new DataLoader<string, Profile | null>(async (userIds) => {
    const profiles = await prisma.profile.findMany({
      where: { userId: { in: [...userIds] } },
    });
    return userIds.map((id) => {
      const match = profiles.find((p) => p.userId === id);
      return match ?? null;
    });
  });
};
