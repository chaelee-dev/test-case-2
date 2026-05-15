import { ForbiddenError, NotFoundError, ValidationError } from '../errors/index.js';
import * as articleRepo from '../repos/articleRepo.js';
import * as commentRepo from '../repos/commentRepo.js';
import type { CommentWithAuthor } from '../repos/commentRepo.js';
import * as followRepo from '../repos/followRepo.js';

export interface CommentView {
  id: number;
  createdAt: string;
  updatedAt: string;
  body: string;
  author: {
    username: string;
    bio: string;
    image: string | null;
    following: boolean;
  };
}

async function toView(c: CommentWithAuthor, viewerId: number | null): Promise<CommentView> {
  const following = viewerId === null ? false : await followRepo.exists(viewerId, c.authorId);
  return {
    id: c.id,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
    body: c.body,
    author: {
      username: c.author.username,
      bio: c.author.bio,
      image: c.author.image,
      following,
    },
  };
}

export async function list(slug: string, viewerId: number | null): Promise<CommentView[]> {
  const article = await articleRepo.findBySlug(slug);
  if (!article) throw new NotFoundError('article not found');
  const comments = await commentRepo.listByArticleId(article.id);
  return Promise.all(comments.map((c) => toView(c, viewerId)));
}

export async function add(viewerId: number, slug: string, body: unknown): Promise<CommentView> {
  if (typeof body !== 'string' || body.trim().length === 0) {
    throw new ValidationError('body', "can't be empty");
  }
  const article = await articleRepo.findBySlug(slug);
  if (!article) throw new NotFoundError('article not found');
  const created = await commentRepo.create({ articleId: article.id, authorId: viewerId, body });
  return toView(created, viewerId);
}

export async function remove(viewerId: number, slug: string, commentId: number): Promise<void> {
  const article = await articleRepo.findBySlug(slug);
  if (!article) throw new NotFoundError('article not found');
  const comment = await commentRepo.findById(commentId);
  if (!comment || comment.articleId !== article.id) {
    throw new NotFoundError('comment not found');
  }
  // 댓글 작성자 OR 글 작성자
  if (comment.authorId !== viewerId && article.authorId !== viewerId) {
    throw new ForbiddenError();
  }
  await commentRepo.deleteById(commentId);
}
