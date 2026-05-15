import type { Comment, User } from '@prisma/client';

import { getPrisma } from '../config/prisma.js';

export type CommentWithAuthor = Comment & { author: User };

export async function listByArticleId(articleId: number): Promise<CommentWithAuthor[]> {
  return getPrisma().comment.findMany({
    where: { articleId },
    include: { author: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function create(input: {
  articleId: number;
  authorId: number;
  body: string;
}): Promise<CommentWithAuthor> {
  return getPrisma().comment.create({
    data: input,
    include: { author: true },
  });
}

export async function findById(id: number): Promise<CommentWithAuthor | null> {
  return getPrisma().comment.findUnique({ where: { id }, include: { author: true } });
}

export async function deleteById(id: number): Promise<void> {
  await getPrisma().comment.delete({ where: { id } });
}
