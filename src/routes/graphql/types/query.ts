import { PrismaClient } from '@prisma/client';
import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { UUIDType } from './uuid.js';
import postType from './post.js';
import memberType, { memberTypeId } from './member.js';
import profileType from './profile.js';
import userType, { TUser } from './user.js';

const queryType = new GraphQLObjectType({
  name: 'query',
  fields: {
    post: {
      type: postType,
      resolve: async (_source, { id }: { id: string }, context: PrismaClient) => {
        const post = await context.post.findUnique({
          where: {
            id: id,
          },
        });
        return post;
      },
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
          description: 'Post id',
        },
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(postType))),
      resolve: async (_source, _args, context: PrismaClient) => {
        const posts = await context.post.findMany();
        return posts;
      },
    },
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(memberType))),
      resolve: async (_source, _args, context: PrismaClient) => {
        const memberTypes = await context.memberType.findMany();
        return memberTypes;
      },
    },
    memberType: {
      type: memberType,
      resolve: async (
        _source,
        { id }: { id: 'BASIC' | 'BUSINESS' },
        context: PrismaClient,
      ) => {
        const memberType = await context.memberType.findUnique({
          where: {
            id: id,
          },
        });
        return memberType;
      },
      args: {
        id: {
          type: memberTypeId,
          description: 'Member type id',
        },
      },
    },
    profiles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(profileType))),
      resolve: async (_source, _args, context: PrismaClient) => {
        const profiles = await context.profile.findMany();
        return profiles;
      },
    },
    profile: {
      type: profileType,
      resolve: async (_source, { id }: { id: string }, context: PrismaClient) => {
        const profile = await context.profile.findUnique({
          where: {
            id: id,
          },
        });
        return profile;
      },
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
          description: 'Profile uuid',
        },
      },
    },

    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(userType))),
      resolve: async (_source, _args, context: PrismaClient) => {
        const users = context.user.findMany();
        return users;
      },
    },

    user: {
      type: userType as GraphQLObjectType<TUser, PrismaClient>,
      resolve: async (_source, { id }: { id: string }, context: PrismaClient) => {
        const user = context.user.findUnique({
          where: {
            id: id,
          },
        });
        return user;
      },
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
          description: 'User uuid',
        },
      },
    },
  },
});

export { queryType as default };
