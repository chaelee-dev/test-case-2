import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../auth/useAuth.js';
import { getProfile } from '../api/endpoints/profiles.js';
import { listArticles } from '../api/endpoints/articles.js';
import type { Profile, Article } from '../types/domain.js';
import { parseApiErrors } from '../api/parseErrors.js';
import { ArticleCard } from '../components/ArticleCard.js';
import { ErrorList } from '../components/ErrorList.js';
import { FollowButton } from '../components/FollowButton.js';

type Tab = 'my' | 'favorited';

export function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tab, setTab] = useState<Tab>('my');
  const [articles, setArticles] = useState<Article[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const isSelf = user?.username === username;

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    setErrors([]);
    getProfile(username)
      .then(({ profile: p }) => setProfile(p))
      .catch((err) => setErrors(parseApiErrors(err)))
      .finally(() => setLoading(false));
  }, [username]);

  useEffect(() => {
    if (!username) return;
    const params = tab === 'my' ? { author: username } : { favorited: username };
    listArticles({ ...params, limit: 20 })
      .then((res) => setArticles(res.articles))
      .catch(() => setArticles([]));
  }, [username, tab]);

  if (loading) return <div className="container">Loading...</div>;
  if (!profile) {
    return (
      <div className="container">
        <ErrorList errors={errors.length > 0 ? errors : ['profile not found']} />
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              {profile.image && <img src={profile.image} className="user-img" alt="" />}
              <h4>{profile.username}</h4>
              {profile.bio && <p>{profile.bio}</p>}
              {user && (
                <FollowButton
                  profile={profile}
                  isSelf={isSelf}
                  onChange={(p) => setProfile(p)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <div className="articles-toggle">
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <button
                    type="button"
                    className={`nav-link ${tab === 'my' ? 'active' : ''}`}
                    onClick={() => setTab('my')}
                  >
                    My Articles
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    className={`nav-link ${tab === 'favorited' ? 'active' : ''}`}
                    onClick={() => setTab('favorited')}
                  >
                    Favorited Articles
                  </button>
                </li>
              </ul>
            </div>
            {articles.length === 0 ? <p>No articles are here... yet.</p> : null}
            {articles.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
