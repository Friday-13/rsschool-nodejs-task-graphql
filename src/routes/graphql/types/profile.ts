import { GraphQLBoolean, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { UUIDType } from "./uuid.js";
import memberType from "./member.js";
import { PrismaClient } from "@prisma/client";
import { Static } from "@sinclair/typebox";
import { profileSchema } from "../../profiles/schemas.js";

type TProfile = Static<typeof profileSchema>;


const profileType = new GraphQLObjectType<TProfile, PrismaClient>({
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
      resolve: async (profile, _args, context) => {
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

export {profileType as default}
