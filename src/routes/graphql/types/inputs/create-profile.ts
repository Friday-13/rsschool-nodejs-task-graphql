import { GraphQLBoolean, GraphQLInputObjectType, GraphQLInt, GraphQLNonNull } from "graphql";
import { UUIDType } from "../uuid.js";
import { memberTypeId } from "../member.js";
import { createProfileSchema } from "../../../profiles/schemas.js";
import { Static } from "@sinclair/typebox";

export type TCreateProfile = Static<typeof createProfileSchema.body>;
export const createProfileInputType = new GraphQLInputObjectType({
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
