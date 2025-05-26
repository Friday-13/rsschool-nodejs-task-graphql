import { Post, PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';

export const createPostLoader = (prisma: PrismaClient) => {
  return new DataLoader<string, Post[]>(async (authorIds) => {
    const posts = await prisma.post.findMany({
      where: { authorId: { in: [...authorIds] } },
    });
    return authorIds.map((id) => {
      const match = posts.filter((p) => p.authorId === id);
      return match ?? null;
    });
  });
};
