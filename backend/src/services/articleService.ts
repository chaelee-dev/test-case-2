import { z } from 'zod';

import { getEnv } from '../config/env.js';
import { NotFoundError, ValidationError } from '../errors/index.js';
import * as articleRepo from '../repos/articleRepo.js';
import type { ArticleWithRelations } from '../repos/articleRepo.js';
import * as favoriteRepo from '../repos/favoriteRepo.js';
import * as followRepo from '../repos/followRepo.js';

export interface ArticleAuthorView {
  username: string;
  bio: string;
  image: string | null;
  following: boolean;
}

export interface ArticleView {
  slug: string;
  title: string;
  description: string;
  body?: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  author: ArticleAuthorView;
}

const ListQuerySchema = z.object({
  tag: z.string().optional(),
  author: z.string().optional(),
  favorited: z.string().optional(),
  limit: z.coerce.number().int().min(1).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

function parseListQuery(raw: unknown): {
  tag?: string;
  authorUsername?: string;
  favoritedByUsername?: string;
  limit: number;
  offset: number;
} {
  const parsed = ListQuerySchema.safeParse(raw);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const field = (issue?.path[0] as string) ?? 'query';
    const msg = issue?.message ?? 'invalid';
    throw new ValidationError(field, msg);
  }
  const env = getEnv();
  if (parsed.data.limit > env.MAX_PAGE_LIMIT) {
    throw new ValidationError('limit', `must be <=${env.MAX_PAGE_LIMIT}`);
  }
  return {
    tag: parsed.data.tag,
    authorUsername: parsed.data.author,
    favoritedByUsername: parsed.data.favorited,
    limit: parsed.data.limit,
    offset: parsed.data.offset,
  };
}

async function buildViews(
  articles: ArticleWithRelations[],
  viewerId: number | null,
  includeBody: boolean,
): Promise<ArticleView[]> {
  if (articles.length === 0) return [];
  const articleIds = articles.map((a) => a.id);
  const countsMap = await favoriteRepo.countByArticles(articleIds);
  const favoritedSet =
    viewerId === null ? new Set<number>() : await favoriteRepo.findFavoritedArticleIds(viewerId, articleIds);

  const authorIds = Array.from(new Set(articles.map((a) => a.authorId)));
  const followingSet: Set<number> = viewerId === null ? new Set() : new Set();
  if (viewerId !== null) {
    for (const authorId of authorIds) {
      if (await followRepo.exists(viewerId, authorId)) followingSet.add(authorId);
    }
  }

  return articles.map((a) => ({
    slug: a.slug,
    title: a.title,
    description: a.description,
    ...(includeBody ? { body: a.body } : {}),
    tagList: a.tags.map((t) => t.tag.name).sort(),
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
    favorited: favoritedSet.has(a.id),
    favoritesCount: countsMap.get(a.id) ?? 0,
    author: {
      username: a.author.username,
      bio: a.author.bio,
      image: a.author.image,
      following: followingSet.has(a.authorId),
    },
  }));
}

export async function list(
  rawQuery: unknown,
  viewerId: number | null,
): Promise<{ articles: ArticleView[]; articlesCount: number }> {
  const filters = parseListQuery(rawQuery);
  const { articles, total } = await articleRepo.listArticles(filters);
  const views = await buildViews(articles, viewerId, false);
  return { articles: views, articlesCount: total };
}

export async function getBySlug(slug: string, viewerId: number | null): Promise<ArticleView> {
  const article = await articleRepo.findBySlug(slug);
  if (!article) throw new NotFoundError('article not found');
  const views = await buildViews([article], viewerId, true);
  return views[0]!;
}
