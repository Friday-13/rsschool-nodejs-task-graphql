import {
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import userType from './user.js';
import { PrismaClient } from '@prisma/client';
import { Static } from '@sinclair/typebox';
import { createUserSchema } from '../../users/schemas.js';

type TCreateUser = Static<typeof createUserSchema.body>;

const createUserInputType = new GraphQLInputObjectType({
  name: 'CreateUserInut',
  fields: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    balance: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
  },
});

const mutationType = new GraphQLObjectType({
  name: 'mutation',
  fields: {
    hello: {
      type: GraphQLString,
      resolve: () => {
        return 'Hello world';
      },
    },

    createUser: {
      type: new GraphQLNonNull(userType),
      resolve: async (_source, { dto }: { dto: TCreateUser }, context: PrismaClient) => {
        const user = await context.user.create({
          data: dto,
        });
        return user;
      },
      args: {
        dto: {
          type: createUserInputType,
        },
      },
    },
  },
});

export { mutationType as default };
