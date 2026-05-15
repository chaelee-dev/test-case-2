export interface AuthUser {
  email: string;
  token: string;
  username: string;
  bio: string;
  image: string | null;
}

export interface Profile {
  username: string;
  bio: string;
  image: string | null;
  following: boolean;
}

export interface ArticleAuthor {
  username: string;
  bio: string;
  image: string | null;
  following: boolean;
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  body?: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  author: ArticleAuthor;
}

export interface Comment {
  id: number;
  createdAt: string;
  updatedAt: string;
  body: string;
  author: ArticleAuthor;
}

export interface ApiErrorBody {
  errors: Record<string, string[]>;
}
