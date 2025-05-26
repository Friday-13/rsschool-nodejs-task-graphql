import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import userType from './user.js';
import profileType from './profile.js';
import { UUIDType } from './uuid.js';
import postType from './post.js';
import { TContext } from '../loaders/create-context.js';
import { TCreateUser, createUserInputType } from './inputs/create-user.js';
import { TCreateProfile, createProfileInputType } from './inputs/create-profile.js';
import { TCreatePost, createPostInputType } from './inputs/create-post.js';
import { TChangePost, changePostInputType } from './inputs/change-post.js';
import { TChangeProfile, changeProfileInputType } from './inputs/change-profile.js';
import { TChangeUser, changeUserInputType } from './inputs/change-user.js';


const mutationType = new GraphQLObjectType<undefined, TContext>({
  name: 'mutation',
  fields: {
    createUser: {
      type: new GraphQLNonNull(userType),
      resolve: async (_source, { dto }: { dto: TCreateUser }, { prisma }) => {
        const user = await prisma.user.create({
          data: dto,
        });
        return user;
      },
      args: {
        dto: {
          type: new GraphQLNonNull(createUserInputType),
        },
      },
    },

    createProfile: {
      type: new GraphQLNonNull(profileType),
      resolve: async (_source, { dto }: { dto: TCreateProfile }, { prisma }) => {
        const profile = await prisma.profile.create({
          data: dto,
        });
        return profile;
      },
      args: {
        dto: {
          type: new GraphQLNonNull(createProfileInputType),
        },
      },
    },

    createPost: {
      type: new GraphQLNonNull(postType),
      resolve: async (_source, { dto }: { dto: TCreatePost }, { prisma }) => {
        const post = await prisma.post.create({
          data: dto,
        });
        return post;
      },
      args: {
        dto: {
          type: new GraphQLNonNull(createPostInputType),
        },
      },
    },

    changePost: {
      type: new GraphQLNonNull(postType),
      resolve: async (
        _source,
        { id, dto }: { id: string; dto: TChangePost },
        { prisma },
      ) => {
        const post = await prisma.post.update({
          where: { id: id },
          data: dto,
        });
        return post;
      },
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
        dto: {
          type: new GraphQLNonNull(changePostInputType),
        },
      },
    },

    changeProfile: {
      type: new GraphQLNonNull(profileType),
      resolve: async (
        _source,
        { id, dto }: { id: string; dto: TChangeProfile },
        { prisma },
      ) => {
        const profile = await prisma.profile.update({ where: { id: id }, data: dto });
        return profile;
      },
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
        dto: {
          type: new GraphQLNonNull(changeProfileInputType),
        },
      },
    },

    changeUser: {
      type: new GraphQLNonNull(userType),
      resolve: async (
        _source,
        { id, dto }: { id: 'string'; dto: TChangeUser },
        { prisma },
      ) => {
        const user = await prisma.user.update({ where: { id: id }, data: dto });
        return user;
      },
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
        dto: {
          type: new GraphQLNonNull(changeUserInputType),
        },
      },
    },

    deleteUser: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: async (_source, { id }: { id: string }, {prisma}) => {
        const user = await prisma.user.delete({ where: { id: id } });
        if (user) return 'OK';
        return 'FAIL';
      },
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
    },

    deletePost: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: async (_source, { id }: { id: string }, {prisma}) => {
        const post = await prisma.post.delete({ where: { id: id } });
        if (post) return 'OK';
        return 'FAIL';
      },
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
    },

    deleteProfile: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: async (_source, { id }: { id: string }, {prisma}) => {
        const profile = await prisma.profile.delete({ where: { id: id } });
        if (profile) return 'OK';
        return 'FAIL';
      },
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
    },

    subscribeTo: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: async (
        _source,
        { userId, authorId }: { userId: string; authorId: string },
        {prisma},
      ) => {
        const res = await prisma.subscribersOnAuthors.create({
          data: {
            authorId: authorId,
            subscriberId: userId,
          },
        });
        if (res) return 'OK';
        return 'FAIL';
      },
      args: {
        userId: {
          type: new GraphQLNonNull(UUIDType),
        },
        authorId: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
    },

    unsubscribeFrom: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: async (
        _source,
        { userId, authorId }: { userId: string; authorId: string },
        {prisma},
      ) => {
        const res = await prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: {
              authorId: authorId,
              subscriberId: userId,
            },
          },
        });
        if (res) return 'OK';
        return 'FAIL';
      },
      args: {
        userId: {
          type: new GraphQLNonNull(UUIDType),
        },
        authorId: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
    },
  },
});

export { mutationType as default };
