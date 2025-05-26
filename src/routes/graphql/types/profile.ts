import { GraphQLBoolean, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { UUIDType } from './uuid.js';
import memberType from './member.js';
import { Static } from '@sinclair/typebox';
import { profileSchema } from '../../profiles/schemas.js';
import { TContext } from '../loaders/create-context.js';

type TProfile = Static<typeof profileSchema>;

const profileType = new GraphQLObjectType<TProfile, TContext>({
  name: 'Profile',
  description: 'Profile',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
    isMale: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    yearOfBirth: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    memberType: {
      type: new GraphQLNonNull(memberType),
      resolve: async (profile, _args, { memberTypeLoader }) => {
        return (await memberTypeLoader.load(profile.memberTypeId))
      },
    },
  }),
});

export { profileType as default };
