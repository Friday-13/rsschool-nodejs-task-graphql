import { PrismaClient, User } from '@prisma/client';
import DataLoader from 'dataloader';

export const createSubscribedToUserLoader = (prisma: PrismaClient) => {
  return new DataLoader<string, User[]>(async (userIds) => {
    const users = await prisma.subscribersOnAuthors.findMany({
      include: {
        subscriber: true,
      },
      where: {
        authorId: {
          in: [...userIds],
        },
      },
    });
    return userIds.map((id) => {
      const match = users.filter((p) => p.authorId === id);
      return match.map((m) => m.subscriber) ?? null;
    });
  });
};
