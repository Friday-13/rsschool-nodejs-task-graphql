import {
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './uuid.js';
import profileType from './profile.js';
import { Static } from '@sinclair/typebox';
import { userSchema } from '../../users/schemas.js';
import { TContext } from '../loaders/create-context.js';
import postType from './post.js';

export type TUser = Static<typeof userSchema>;

const userType = new GraphQLObjectType<TUser, TContext>({
  name: 'User',
  description: 'User',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    balance: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    profile: {
      type: profileType,
      resolve: async (user, _args, { profileLoader }) => {
        return profileLoader.load(user.id);
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(postType))),
      resolve: async (user, _args, { postLoader }) => {
        return await postLoader.load(user.id);
      },
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(userType))),
      resolve: async (user, _args, { userSubscribedToLoader }) => {
        return await userSubscribedToLoader.load(user.id);
      },
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(userType))),
      resolve: async (user, _args, { subscribedToUserLoader }) => {
        return await subscribedToUserLoader.load(user.id);
      },
    },
  }),
});

export { userType as default };
