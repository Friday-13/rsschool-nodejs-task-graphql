import { Static } from "@sinclair/typebox";
import { changeProfileByIdSchema } from "../../../profiles/schemas.js";
import { GraphQLBoolean, GraphQLInputObjectType, GraphQLInt } from "graphql";
import { memberTypeId } from "../member.js";

export type TChangeProfile = Static<typeof changeProfileByIdSchema.body>;
export const changeProfileInputType = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: {
    isMale: {
      type: GraphQLBoolean,
    },
    yearOfBirth: {
      type: GraphQLInt,
    },
    memberTypeId: {
      type: memberTypeId,
    },
  },
});

