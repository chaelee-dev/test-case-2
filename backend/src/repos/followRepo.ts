import { getPrisma } from '../config/prisma.js';

export async function exists(followerId: number, followeeId: number): Promise<boolean> {
  const row = await getPrisma().follow.findUnique({
    where: { followerId_followeeId: { followerId, followeeId } },
  });
  return row !== null;
}

export async function create(followerId: number, followeeId: number): Promise<void> {
  await getPrisma().follow.upsert({
    where: { followerId_followeeId: { followerId, followeeId } },
    update: {},
    create: { followerId, followeeId },
  });
}

export async function remove(followerId: number, followeeId: number): Promise<void> {
  await getPrisma()
    .follow.deleteMany({ where: { followerId, followeeId } });
}
