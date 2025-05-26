import { createProfileLoader } from './profile-loader.js';
import { createPostLoader } from './create-post-loader.js';
import { createMemberTypeLoader } from './create-member-type-loader.js';
import { createSubscribedToUserLoader } from './create-subscribed-to-user-loader.js';
import { PrismaClient } from '@prisma/client';

export const createContext = (prisma: PrismaClient) => {
  return {
    prisma,
    profileLoader: createProfileLoader(prisma),
    postLoader: createPostLoader(prisma),
    memberTypeLoader: createMemberTypeLoader(prisma),
    userSubscribedToLoader: createSubscribedToUserLoader(prisma),
    subscribedToUserLoader: createSubscribedToUserLoader(prisma),

    // usersLoader: new DataLoader<string, User[]>(async (userIds) => {
    //   const users = await prisma.user.findMany({
    //     where: {id : { in: [...userIds] } },
    //   });
    //   return userIds.map((id) => {
    //     const match = users.filter((uuser) => uuser.id === id);
    //     return match ?? null;
    //   });
    // })
  };
};

export type TContext = ReturnType<typeof createContext>;
