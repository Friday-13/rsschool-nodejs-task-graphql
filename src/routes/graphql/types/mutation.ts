import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import userType from './user.js';
import { Static } from '@sinclair/typebox';
import { changeUserByIdSchema, createUserSchema } from '../../users/schemas.js';
import profileType from './profile.js';
import { UUIDType } from './uuid.js';
import { memberTypeId } from './member.js';
import { changeProfileByIdSchema, createProfileSchema } from '../../profiles/schemas.js';
import postType from './post.js';
import { changePostByIdSchema, createPostSchema } from '../../posts/schemas.js';
import { TContext } from '../loaders/create-context.js';

type TCreateUser = Static<typeof createUserSchema.body>;

const createUserInputType = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    balance: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
  },
});

type TCreateProfile = Static<typeof createProfileSchema.body>;
const createProfileInputType = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: {
    isMale: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    yearOfBirth: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    userId: {
      type: new GraphQLNonNull(UUIDType),
    },
    memberTypeId: {
      type: new GraphQLNonNull(memberTypeId),
    },
  },
});

type TCreatePost = Static<typeof createPostSchema.body>;
const createPostInputType = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    title: {
      type: new GraphQLNonNull(GraphQLString),
    },
    content: {
      type: new GraphQLNonNull(GraphQLString),
    },
    authorId: {
      type: new GraphQLNonNull(UUIDType),
    },
  },
});

type TChangePost = Static<typeof changePostByIdSchema.body>;
const changePostInputType = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: {
    title: {
      type: GraphQLString,
    },
    content: {
      type: GraphQLString,
    },
  },
});

type TChangeProfile = Static<typeof changeProfileByIdSchema.body>;
const changeProfileInputType = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: {
    isMale: {
      type: GraphQLBoolean,
    },
    yearOfBirth: {
      type: GraphQLInt,
    },
    memberTypeId: {
      type: memberTypeId,
    },
  },
});

type TChangeUser = Static<typeof changeUserByIdSchema.body>;
const changeUserInputType = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: {
      type: GraphQLString,
    },
    balance: {
      type: GraphQLFloat,
    },
  },
});

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
