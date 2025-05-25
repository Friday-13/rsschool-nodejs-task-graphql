import { GraphQLFloat, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { UUIDType } from "./uuid.js";
import { PrismaClient } from "@prisma/client";
import postType from "./post.js";
import profileType from "./profile.js";
import { Static } from "@sinclair/typebox";
import { userSchema } from "../../users/schemas.js";
import { TContext } from "../index.js";

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
      resolve: async (user, _args, context) => {
        return context.profileLoader.load(user.id);
      },
    },
  //   posts: {
  //     type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(postType))),
  //     resolve: async (user, _args, context) => {
  //       const posts = context.post.findMany({
  //         where: {
  //           authorId: user.id,
  //         },
  //       });
  //       return posts;
  //     },
  //   },
  //   userSubscribedTo: {
  //     type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(userType))),
  //     resolve: async (user, _args, context) => {
  //       const users = context.user.findMany({
  //         where: {
  //           subscribedToUser: {
  //             some: {
  //               subscriberId: user.id,
  //             },
  //           },
  //         },
  //       });
  //       return users;
  //     },
  //   },
  //   subscribedToUser: {
  //     type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(userType))),
  //     resolve: async (user, _args, context) => {
  //       const users = context.user.findMany({
  //         where: {
  //           userSubscribedTo: {
  //             some: {
  //               authorId: user.id,
  //             },
  //           },
  //         },
  //       });
  //       return users;
  //     },
  //   },
  }),
});

export {userType as default}
