import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CommentItem } from '../components/CommentItem.js';
import type { Comment } from '../types/domain.js';

const sample: Comment = {
  id: 1,
  createdAt: '2026-05-15T00:00:00Z',
  updatedAt: '2026-05-15T00:00:00Z',
  body: 'hello world',
  author: { username: 'jane', bio: '', image: null, following: false },
};

describe('CommentItem', () => {
  it('body + author 렌더', () => {
    render(
      <MemoryRouter>
        <CommentItem comment={sample} canDelete={false} onDelete={() => {}} />
      </MemoryRouter>,
    );
    expect(screen.getByText('hello world')).toBeInTheDocument();
    expect(screen.getByText('jane')).toBeInTheDocument();
  });

  it('canDelete=true → delete 버튼', () => {
    const onDelete = vi.fn();
    render(
      <MemoryRouter>
        <CommentItem comment={sample} canDelete={true} onDelete={onDelete} />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByLabelText('Delete comment'));
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it('canDelete=false → delete 버튼 없음', () => {
    render(
      <MemoryRouter>
        <CommentItem comment={sample} canDelete={false} onDelete={() => {}} />
      </MemoryRouter>,
    );
    expect(screen.queryByLabelText('Delete comment')).not.toBeInTheDocument();
  });
});
