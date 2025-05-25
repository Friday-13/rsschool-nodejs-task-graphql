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
import { createContext } from './loaders/create-context.js';

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
        contextValue: createContext(prisma),
        schema,
        source,
        variableValues: req.body.variables,
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
