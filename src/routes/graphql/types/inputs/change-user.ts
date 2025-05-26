import { Static } from "@sinclair/typebox";
import { changeUserByIdSchema } from "../../../users/schemas.js";
import { GraphQLFloat, GraphQLInputObjectType, GraphQLString } from "graphql";

export type TChangeUser = Static<typeof changeUserByIdSchema.body>;
export const changeUserInputType = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: {
      type: GraphQLString,
    },
    balance: {
      type: GraphQLFloat,
    },
  },
});
