import { useState } from 'react';
import type { Profile } from '../types/domain.js';
import { followUser, unfollowUser } from '../api/endpoints/profiles.js';

interface Props {
  profile: Profile;
  isSelf: boolean;
  onChange: (profile: Profile) => void;
}

export function FollowButton({ profile, isSelf, onChange }: Props) {
  const [pending, setPending] = useState(false);

  async function toggle() {
    if (isSelf || pending) return;
    setPending(true);
    try {
      const fn = profile.following ? unfollowUser : followUser;
      const res = await fn(profile.username);
      onChange(res.profile);
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      className={`btn btn-sm ${profile.following ? 'btn-secondary' : 'btn-outline-secondary'}`}
      onClick={toggle}
      disabled={isSelf || pending}
      aria-label={profile.following ? 'Unfollow' : 'Follow'}
    >
      <i className="ion-plus-round" />
      &nbsp;{profile.following ? 'Unfollow' : 'Follow'} {profile.username}
    </button>
  );
}
