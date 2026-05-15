import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FollowButton } from '../components/FollowButton.js';
import type { Profile } from '../types/domain.js';

const fetchMock = vi.fn();

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
  fetchMock.mockReset();
});

const profile: Profile = { username: 'jane', bio: '', image: null, following: false };

describe('FollowButton', () => {
  it('isSelf=true → disabled', () => {
    render(<FollowButton profile={profile} isSelf={true} onChange={() => {}} />);
    expect(screen.getByLabelText('Follow')).toBeDisabled();
  });

  it('isSelf=false + 클릭 → POST follow', () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ profile: { ...profile, following: true } }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    const onChange = vi.fn();
    render(<FollowButton profile={profile} isSelf={false} onChange={onChange} />);
    fireEvent.click(screen.getByLabelText('Follow'));
    expect(fetchMock).toHaveBeenCalled();
  });

  it('following=true → Unfollow 라벨', () => {
    render(<FollowButton profile={{ ...profile, following: true }} isSelf={false} onChange={() => {}} />);
    expect(screen.getByLabelText('Unfollow')).toBeInTheDocument();
  });
});
