import { Static } from "@sinclair/typebox";
import { changePostByIdSchema } from "../../../posts/schemas.js";
import { GraphQLInputObjectType, GraphQLString } from "graphql";

export type TChangePost = Static<typeof changePostByIdSchema.body>;
export const changePostInputType = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: {
    title: {
      type: GraphQLString,
    },
    content: {
      type: GraphQLString,
    },
  },
});
