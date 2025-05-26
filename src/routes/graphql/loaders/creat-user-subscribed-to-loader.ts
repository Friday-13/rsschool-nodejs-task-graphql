import { PrismaClient, User } from "@prisma/client";
import DataLoader from "dataloader";

export const createUserSubscribedToLoader = (prisma: PrismaClient) => {
  return new DataLoader<string, User[]>(async (userIds) => {
      const users = await prisma.subscribersOnAuthors.findMany({
        include: {
          author: true,
        },
        where: {
          subscriberId: {
            in: [...userIds],
          },
        },
      });
      const grouped = new Map<string, User[]>();
      for (const sub of users) {
        const arr = grouped.get(sub.subscriberId) ?? [];
        arr.push(sub.author);
        grouped.set(sub.subscriberId, arr);
      }

      return userIds.map((id) => grouped.get(id) ?? []);
    })
}
