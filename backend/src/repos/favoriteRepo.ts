import { getPrisma } from '../config/prisma.js';

export async function exists(userId: number, articleId: number): Promise<boolean> {
  const row = await getPrisma().favorite.findUnique({
    where: { userId_articleId: { userId, articleId } },
  });
  return row !== null;
}

export async function create(userId: number, articleId: number): Promise<void> {
  await getPrisma().favorite.upsert({
    where: { userId_articleId: { userId, articleId } },
    update: {},
    create: { userId, articleId },
  });
}

export async function remove(userId: number, articleId: number): Promise<void> {
  await getPrisma().favorite.deleteMany({ where: { userId, articleId } });
}

export async function countByArticle(articleId: number): Promise<number> {
  return getPrisma().favorite.count({ where: { articleId } });
}

export async function countByArticles(articleIds: number[]): Promise<Map<number, number>> {
  if (articleIds.length === 0) return new Map();
  const rows = await getPrisma().favorite.groupBy({
    by: ['articleId'],
    where: { articleId: { in: articleIds } },
    _count: { articleId: true },
  });
  const map = new Map<number, number>();
  for (const r of rows) map.set(r.articleId, r._count.articleId);
  return map;
}

export async function findFavoritedArticleIds(
  userId: number,
  articleIds: number[],
): Promise<Set<number>> {
  if (articleIds.length === 0) return new Set();
  const rows = await getPrisma().favorite.findMany({
    where: { userId, articleId: { in: articleIds } },
    select: { articleId: true },
  });
  return new Set(rows.map((r) => r.articleId));
}
