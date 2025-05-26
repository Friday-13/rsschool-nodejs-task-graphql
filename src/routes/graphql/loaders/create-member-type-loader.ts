import { MemberType, PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';

export const createMemberTypeLoader = (prisma: PrismaClient) => {
  return new DataLoader<string, MemberType | null>(async (profileMemberIds) => {
    const profiles = await prisma.memberType.findMany({
      where: { id: { in: [...profileMemberIds] } },
    });
    return profileMemberIds.map((id) => {
      const match = profiles.find((p) => p.id === id);
      return match ?? null;
    });
  });
};
