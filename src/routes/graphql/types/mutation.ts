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
import { PrismaClient } from '@prisma/client';
import { Static } from '@sinclair/typebox';
import { createUserSchema } from '../../users/schemas.js';
import profileType from './profile.js';
import { UUIDType } from './uuid.js';
import { memberTypeId } from './member.js';
import { createProfileSchema } from '../../profiles/schemas.js';

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

    createProfile: {
      type: new GraphQLNonNull(profileType),
      resolve: async (_source, { dto }: { dto: TCreateProfile }, context) => {
        const profile = context.profile.create({
          data: dto,
        });
        return profile;
      },
      args: {
        dto: {
          type: createProfileInputType,
        },
      },
    },
  },
});

export { mutationType as default };
