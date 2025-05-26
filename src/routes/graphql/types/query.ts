import { PrismaClient, User } from '@prisma/client';
import { GraphQLList, GraphQLNonNull, GraphQLObjectType, Kind } from 'graphql';
import { UUIDType } from './uuid.js';
import postType from './post.js';
import memberType, { memberTypeId } from './member.js';
import profileType from './profile.js';
import userType, { TUser } from './user.js';
import { TContext } from '../loaders/create-context.js';
import { parseResolveInfo } from 'graphql-parse-resolve-info';

const queryType = new GraphQLObjectType<undefined, TContext>({
  name: 'query',
  fields: {
    post: {
      type: postType,
      resolve: async (_source, { id }: { id: string }, { prisma }) => {
        const post = await prisma.post.findUnique({
          where: {
            id: id,
          },
        });
        return post;
      },
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
          description: 'Post id',
        },
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(postType))),
      resolve: async (_source, _args, { prisma }) => {
        const posts = await prisma.post.findMany();
        return posts;
      },
    },
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(memberType))),
      resolve: async (_source, _args, { prisma }) => {
        const memberTypes = await prisma.memberType.findMany();
        return memberTypes;
      },
    },
    memberType: {
      type: memberType,
      resolve: async (_source, { id }: { id: 'BASIC' | 'BUSINESS' }, { prisma }) => {
        const memberType = await prisma.memberType.findUnique({
          where: {
            id: id,
          },
        });
        return memberType;
      },
      args: {
        id: {
          type: memberTypeId,
          description: 'Member type id',
        },
      },
    },
    profiles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(profileType))),
      resolve: async (_source, _args, { prisma }) => {
        const profiles = await prisma.profile.findMany();
        return profiles;
      },
    },
    profile: {
      type: profileType,
      resolve: async (_source, { id }: { id: string }, { prisma }) => {
        const profile = await prisma.profile.findUnique({
          where: {
            id: id,
          },
        });
        return profile;
      },
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
          description: 'Profile uuid',
        },
      },
    },

    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(userType))),
      resolve: async (
        _source,
        _args,
        { prisma, userSubscribedToLoader, subscribedToUserLoader },
        info,
      ) => {
        const isContainField = (fieldName: string) => {
          const selections = info.fieldNodes[0].selectionSet?.selections;
          return selections?.some((selection) => {
            if (selection.kind === Kind.FIELD) {
              return selection.name.value === fieldName;
            }
            return false;
          });
        };
        const users = await prisma.user.findMany({
          include: {
            userSubscribedTo: isContainField('userSubscribedTo'),
            subscribedToUser: isContainField('subscribedToUser'),
          },
        });

        for (const user of users) {
          if (isContainField('subscribedToUser')) {
            const subscribers = user.subscribedToUser.map((sub) =>
              users.find((u) => u.id === sub.subscriberId),
            );
            subscribedToUserLoader.prime(user.id, subscribers as User[]);
          }
          if (isContainField('userSubscribedTo')) {
            const authors = user.userSubscribedTo.map((auth) =>
              users.find((u) => u.id === auth.authorId),
            );
            userSubscribedToLoader.prime(user.id, authors as User[]);
          }
        }
        return users;
      },
    },

    user: {
      type: userType as GraphQLObjectType<TUser, PrismaClient>,
      resolve: async (_source, { id }: { id: string }, { prisma }) => {
        const user = prisma.user.findUnique({
          where: {
            id: id,
          },
        });
        return user;
      },
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
          description: 'User uuid',
        },
      },
    },
  },
});

export { queryType as default };
