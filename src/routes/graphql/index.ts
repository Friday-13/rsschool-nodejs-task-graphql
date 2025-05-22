import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLSchema,
  GraphQLString,
  graphql,
} from 'graphql';
import { PrismaClient } from '@prisma/client';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      return graphql({
        schema,
        source: req.body.query,
        variableValues: req.body.variables,
        contextValue: prisma,
      });
    },
  });
};

const uuidType = new GraphQLScalarType({
  name: 'UUID',
});

const memberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    BASIC: { value: 'BASIC' },
    BUSINESS: { value: 'BUSINESS' },
  },
});

const memberType = new GraphQLObjectType({
  name: 'Member',
  description: 'Member information',
  fields: () => ({
    id: {
      type: memberTypeId,
    },
    discount: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    postsLimitPerMonth: {
      type: new GraphQLNonNull(GraphQLInt),
    },
  }),
});

const postType = new GraphQLObjectType({
  name: 'Post',
  description: "User's post",
  fields: () => ({
    id: {
      type: new GraphQLNonNull(uuidType),
    },
    title: {
      type: new GraphQLNonNull(GraphQLString),
    },
    content: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
});

const profileType = new GraphQLObjectType({
  name: 'Profile',
  description: 'Profile',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(uuidType),
    },
    isMale: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    yearOfBirth: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    memberType: {
      type: new GraphQLNonNull(memberType),
      resolve: async (profile, _args, context: PrismaClient) => {
        const memberType = await context.memberType.findUnique({
          where: {
            id: profile.memberTypeId,
          },
        });
        return memberType;
      },
    },
  }),
});

const userType = new GraphQLObjectType({
  name: 'User',
  description: 'User',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(uuidType),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    balance: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    profile: {
      type: profileType,
      resolve: async (user, _args, context: PrismaClient) => {
        const profile = await context.profile.findUnique({
          where: {
            userId: user.id,
          },
        });
        return profile;
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(postType))),
      resolve: async (user, _args, context: PrismaClient) => {
        const posts = context.post.findMany({
          where: {
            authorId: user.id,
          },
        });
        return posts;
      },
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(userType))),
      resolve: async (user, _args, context: PrismaClient) => {
        const users = context.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                subscriberId: user.id,
              },
            },
          },
        });
        return users;
      },
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(userType))),
      resolve: async (user, _args, context: PrismaClient) => {
        const users = context.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: user.id,
              },
            },
          },
        });
        return users;
      },
    },
  }),
});

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
          type: new GraphQLNonNull(uuidType),
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
          type: new GraphQLNonNull(uuidType),
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
      type: userType,
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
          type: new GraphQLNonNull(uuidType),
          description: 'User uuid',
        },
      },
    },
  },
});

const schema = new GraphQLSchema({
  query: queryType,
  types: [postType, memberType, profileType, userType],
});

export default plugin;
