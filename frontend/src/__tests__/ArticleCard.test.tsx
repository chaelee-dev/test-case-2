import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ArticleCard } from '../components/ArticleCard.js';
import type { Article } from '../types/domain.js';

const sample: Article = {
  slug: 'hello',
  title: 'Hello',
  description: 'd',
  tagList: ['typescript', 'react'],
  createdAt: '2026-05-15T00:00:00Z',
  updatedAt: '2026-05-15T00:00:00Z',
  favorited: false,
  favoritesCount: 3,
  author: { username: 'u', bio: '', image: null, following: false },
};

describe('ArticleCard', () => {
  it('title·description·tagList 렌더', () => {
    render(
      <MemoryRouter>
        <ArticleCard article={sample} />
      </MemoryRouter>,
    );
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('d')).toBeInTheDocument();
    expect(screen.getByText('typescript')).toBeInTheDocument();
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('favorited=true → Unfavorite aria-label', () => {
    render(
      <MemoryRouter>
        <ArticleCard article={{ ...sample, favorited: true }} />
      </MemoryRouter>,
    );
    expect(screen.getByLabelText('Unfavorite')).toBeInTheDocument();
  });
});
