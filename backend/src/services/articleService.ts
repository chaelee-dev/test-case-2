import { z } from 'zod';

import { getEnv } from '../config/env.js';
import { ForbiddenError, NotFoundError, ValidationError } from '../errors/index.js';
import * as articleRepo from '../repos/articleRepo.js';
import type { ArticleWithRelations } from '../repos/articleRepo.js';
import * as favoriteRepo from '../repos/favoriteRepo.js';
import * as followRepo from '../repos/followRepo.js';
import * as tagRepo from '../repos/tagRepo.js';
import { slugify, withSuffix } from '../util/slug.js';

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

const FeedQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

export async function feed(
  viewerId: number,
  rawQuery: unknown,
): Promise<{ articles: ArticleView[]; articlesCount: number }> {
  const parsed = FeedQuerySchema.safeParse(rawQuery);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    throw new ValidationError((issue?.path[0] as string) ?? 'query', issue?.message ?? 'invalid');
  }
  const env = getEnv();
  if (parsed.data.limit > env.MAX_PAGE_LIMIT) {
    throw new ValidationError('limit', `must be <=${env.MAX_PAGE_LIMIT}`);
  }
  const followedIds = await followRepo.findFollowedIds(viewerId);
  const { articles, total } = await articleRepo.listByAuthorIds(
    followedIds,
    parsed.data.limit,
    parsed.data.offset,
  );
  const views = await buildViews(articles, viewerId, false);
  return { articles: views, articlesCount: total };
}

export async function favorite(viewerId: number, slug: string): Promise<ArticleView> {
  const article = await articleRepo.findBySlug(slug);
  if (!article) throw new NotFoundError('article not found');
  await favoriteRepo.create(viewerId, article.id);
  const reloaded = await articleRepo.findById(article.id);
  const views = await buildViews([reloaded!], viewerId, true);
  return views[0]!;
}

export async function unfavorite(viewerId: number, slug: string): Promise<ArticleView> {
  const article = await articleRepo.findBySlug(slug);
  if (!article) throw new NotFoundError('article not found');
  await favoriteRepo.remove(viewerId, article.id);
  const reloaded = await articleRepo.findById(article.id);
  const views = await buildViews([reloaded!], viewerId, true);
  return views[0]!;
}

export async function getBySlug(slug: string, viewerId: number | null): Promise<ArticleView> {
  const article = await articleRepo.findBySlug(slug);
  if (!article) throw new NotFoundError('article not found');
  const views = await buildViews([article], viewerId, true);
  return views[0]!;
}

async function generateUniqueSlug(title: string): Promise<string> {
  const base = slugify(title);
  if (!(await articleRepo.existsBySlug(base))) return base;
  for (let attempt = 0; attempt < 3; attempt++) {
    const candidate = withSuffix(base, title, Date.now() + attempt);
    if (!(await articleRepo.existsBySlug(candidate))) return candidate;
  }
  throw new ValidationError('slug', 'could not generate unique slug after 3 attempts');
}

export async function update(
  viewerId: number,
  slug: string,
  patch: { title?: string; description?: string; body?: string },
): Promise<ArticleView> {
  const article = await articleRepo.findBySlug(slug);
  if (!article) throw new NotFoundError('article not found');
  if (article.authorId !== viewerId) throw new ForbiddenError();

  const updates: { slug?: string; title?: string; description?: string; body?: string } = {};
  if (patch.title !== undefined && patch.title !== article.title) {
    if (patch.title.trim().length === 0) throw new ValidationError('title', "can't be empty");
    updates.title = patch.title;
    updates.slug = await generateUniqueSlug(patch.title);
  }
  if (patch.description !== undefined && patch.description !== article.description) {
    if (patch.description.trim().length === 0) {
      throw new ValidationError('description', "can't be empty");
    }
    updates.description = patch.description;
  }
  if (patch.body !== undefined && patch.body !== article.body) {
    if (patch.body.trim().length === 0) throw new ValidationError('body', "can't be empty");
    updates.body = patch.body;
  }

  if (Object.keys(updates).length === 0) {
    throw new ValidationError('body', 'empty patch');
  }

  const updated = await articleRepo.updateById(article.id, updates);
  const views = await buildViews([updated], viewerId, true);
  return views[0]!;
}

export async function remove(viewerId: number, slug: string): Promise<void> {
  const article = await articleRepo.findBySlug(slug);
  if (!article) throw new NotFoundError('article not found');
  if (article.authorId !== viewerId) throw new ForbiddenError();
  await articleRepo.deleteById(article.id);
}

export async function create(
  authorId: number,
  input: { title?: string; description?: string; body?: string; tagList?: string[] },
): Promise<ArticleView> {
  if (!input.title || input.title.trim().length === 0) {
    throw new ValidationError('title', "can't be empty");
  }
  if (!input.description || input.description.trim().length === 0) {
    throw new ValidationError('description', "can't be empty");
  }
  if (!input.body || input.body.trim().length === 0) {
    throw new ValidationError('body', "can't be empty");
  }

  const slug = await generateUniqueSlug(input.title);
  const tags = input.tagList ? await tagRepo.ensureTags(input.tagList) : [];

  const article = await articleRepo.create({
    slug,
    title: input.title,
    description: input.description,
    body: input.body,
    authorId,
    tagIds: tags.map((t) => t.id),
  });

  const views = await buildViews([article], authorId, true);
  return views[0]!;
}
