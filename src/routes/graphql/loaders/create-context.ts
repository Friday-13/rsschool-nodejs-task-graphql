import { MemberType, Post, PrismaClient, Profile, User } from '@prisma/client';
import DataLoader from 'dataloader';

export const createContext = (prisma: PrismaClient) => {
  return {
    prisma,
    profileLoader: new DataLoader<string, Profile | null>(async (userIds) => {
      const profiles = await prisma.profile.findMany({
        where: { userId: { in: [...userIds] } },
      });
      return userIds.map((id) => {
        const match = profiles.find((p) => p.userId === id);
        return match ?? null;
      });
    }),

    postLoader: new DataLoader<string, Post[]>(async (authorIds) => {
      const posts = await prisma.post.findMany({
        where: { authorId: { in: [...authorIds] } },
      });
      return authorIds.map((id) => {
        const match = posts.filter((p) => p.authorId === id);
        return match ?? null;
      });
    }),

    memberTypeLoader: new DataLoader<string, MemberType | null>(
      async (profileMemberIds) => {
        const profiles = await prisma.memberType.findMany({
          where: { id: { in: [...profileMemberIds] } },
        });
        return profileMemberIds.map((id) => {
          const match = profiles.find((p) => p.id === id);
          return match ?? null;
        });
      },
    ),

    userSubscribedToLoader: new DataLoader<string, User[]>(async (userIds) => {
      const users = await prisma.subscribersOnAuthors.findMany({
        include: {
          author: true,
        },
        where: {
          subscriberId: {
            in: [...userIds],
          },
        },
      });
      const grouped = new Map<string, User[]>();
      for (const sub of users) {
        const arr = grouped.get(sub.subscriberId) ?? [];
        arr.push(sub.author);
        grouped.set(sub.subscriberId, arr);
      }

      return userIds.map((id) => grouped.get(id) ?? []);
    }),

    subscribedToUserLoader: new DataLoader<string, User[]>(async (userIds) => {
      const users = await prisma.subscribersOnAuthors.findMany({
        include: {
          subscriber:true,
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
    }),
  };
};

export type TContext = ReturnType<typeof createContext>;
