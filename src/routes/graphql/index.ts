import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import {
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
      type: new GraphQLNonNull(GraphQLString),
    },
    title: {
      type: new GraphQLNonNull(GraphQLString),
    },
    content: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
});

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    postType: {
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
          type: GraphQLString,
          description: 'Post id',
        },
      },
    },
    postsType: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(postType))),
      resolve: async (_source, _args, context: PrismaClient) => {
        const posts = await context.post.findMany();
        console.log(posts);
        return posts;
      },
    },
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(memberType))),
      resolve: async (_source, _args, context: PrismaClient) => {
        const memberTypes = await context.memberType.findMany();
        console.log(memberTypes);
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
  },
});

const schema = new GraphQLSchema({
  query: queryType,
  types: [postType, memberType],
});

export default plugin;
