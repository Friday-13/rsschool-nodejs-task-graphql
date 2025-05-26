import { createProfileLoader } from './profile-loader.js';
import { createPostLoader } from './create-post-loader.js';
import { createMemberTypeLoader } from './create-member-type-loader.js';
import { createSubscribedToUserLoader } from './create-subscribed-to-user-loader.js';
import { PrismaClient } from '@prisma/client';
import { createUserSubscribedToLoader } from './creat-user-subscribed-to-loader.js';

export const createContext = (prisma: PrismaClient) => {
  return {
    prisma,
    profileLoader: createProfileLoader(prisma),
    postLoader: createPostLoader(prisma),
    memberTypeLoader: createMemberTypeLoader(prisma),
    userSubscribedToLoader: createUserSubscribedToLoader(prisma),
    subscribedToUserLoader: createSubscribedToUserLoader(prisma),
  };
};

export type TContext = ReturnType<typeof createContext>;
