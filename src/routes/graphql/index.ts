import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { GraphQLSchema, graphql, parse, validate } from 'graphql';
import queryType from './types/query.js';
import postType from './types/post.js';
import memberType from './types/member.js';
import profileType from './types/profile.js';
import userType from './types/user.js';
import mutationType from './types/mutation.js';
import depthLimit from 'graphql-depth-limit';
import { PrismaClient, Profile } from '@prisma/client';
import DataLoader from 'dataloader';

const createSuperPuperContext = (prisma: PrismaClient) => {
  return {
    prisma,
    // userLoader: new DataLoader(async (userIds) => {
    //   console.log('========================');
    //   console.log('batch fetch');
    //   console.log('========================');
    //   const users = await prisma.user.findMany({ where: { id: { in: userIds } } });
    //   return userIds.map((id) => users.find((user) => user.id === id));
    // }),
    profileLoader: new DataLoader<string, Profile | null>(async (userIds) => {
      const profiles = await prisma.profile.findMany({
        where: { userId: { in: [...userIds] } },
      });
      return userIds.map((id) => {
        const match = profiles.find((p) => p.userId === id);
        return match ?? null;
      });
    }),
  };
};

export type TContext = ReturnType<typeof createSuperPuperContext>;

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
      const source = req.body.query;
      const validatonErrors = validate(schema, parse(source), [depthLimit(5)]);
      if (validatonErrors.length > 0) {
        return { errors: validatonErrors };
      }
      return graphql({
        schema,
        source,
        variableValues: req.body.variables,
        // contextValue: prisma,
        contextValue: createSuperPuperContext(prisma),
      });
    },
  });
};

const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
  types: [postType, memberType, profileType, userType],
});

export default plugin;
