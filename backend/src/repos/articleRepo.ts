import type { Article, ArticleTag, Tag, User } from '@prisma/client';

import { getPrisma } from '../config/prisma.js';

export type ArticleWithRelations = Article & {
  author: User;
  tags: (ArticleTag & { tag: Tag })[];
};

export interface ListFilters {
  tag?: string;
  authorUsername?: string;
  favoritedByUsername?: string;
  limit: number;
  offset: number;
}

export async function listArticles(
  filters: ListFilters,
): Promise<{ articles: ArticleWithRelations[]; total: number }> {
  const where: Record<string, unknown> = {};
  if (filters.tag) {
    where.tags = { some: { tag: { name: filters.tag } } };
  }
  if (filters.authorUsername) {
    where.author = { username: filters.authorUsername };
  }
  if (filters.favoritedByUsername) {
    where.favorites = { some: { user: { username: filters.favoritedByUsername } } };
  }
  const prisma = getPrisma();
  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      include: { author: true, tags: { include: { tag: true } } },
      orderBy: { createdAt: 'desc' },
      take: filters.limit,
      skip: filters.offset,
    }),
    prisma.article.count({ where }),
  ]);
  return { articles, total };
}

export async function findBySlug(slug: string): Promise<ArticleWithRelations | null> {
  return getPrisma().article.findUnique({
    where: { slug },
    include: { author: true, tags: { include: { tag: true } } },
  });
}

export async function findById(id: number): Promise<ArticleWithRelations | null> {
  return getPrisma().article.findUnique({
    where: { id },
    include: { author: true, tags: { include: { tag: true } } },
  });
}

export async function create(input: {
  slug: string;
  title: string;
  description: string;
  body: string;
  authorId: number;
  tagIds: number[];
}): Promise<ArticleWithRelations> {
  return getPrisma().article.create({
    data: {
      slug: input.slug,
      title: input.title,
      description: input.description,
      body: input.body,
      authorId: input.authorId,
      tags: { create: input.tagIds.map((tagId) => ({ tagId })) },
    },
    include: { author: true, tags: { include: { tag: true } } },
  });
}

export async function existsBySlug(slug: string): Promise<boolean> {
  const found = await getPrisma().article.findUnique({ where: { slug }, select: { id: true } });
  return found !== null;
}

export async function updateById(
  id: number,
  patch: { slug?: string; title?: string; description?: string; body?: string },
): Promise<ArticleWithRelations> {
  return getPrisma().article.update({
    where: { id },
    data: patch,
    include: { author: true, tags: { include: { tag: true } } },
  });
}

export async function deleteById(id: number): Promise<void> {
  await getPrisma().article.delete({ where: { id } });
}
