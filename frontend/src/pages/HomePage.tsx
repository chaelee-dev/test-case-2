import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { listArticles, feedArticles, type ArticlesResponse } from '../api/endpoints/articles.js';
import { listTags } from '../api/endpoints/tags.js';
import { ArticleCard } from '../components/ArticleCard.js';
import { FeedTabs } from '../components/FeedTabs.js';
import { Pagination } from '../components/Pagination.js';
import { TagList } from '../components/TagList.js';
import { ErrorList } from '../components/ErrorList.js';
import { parseApiErrors } from '../api/parseErrors.js';
import { useAuth } from '../auth/useAuth.js';

const LIMIT = 20;

export function HomePage() {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const tab = (params.get('feed') as 'your' | 'global' | null) ?? (user ? 'your' : 'global');
  const tag = params.get('tag') ?? undefined;
  const activeTab: 'your' | 'global' | 'tag' = tag ? 'tag' : tab;
  const offset = Number(params.get('offset') ?? '0');

  const [data, setData] = useState<ArticlesResponse>({ articles: [], articlesCount: 0 });
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setErrors([]);
    const fetcher = activeTab === 'your' && user ? feedArticles : listArticles;
    fetcher({ tag, limit: LIMIT, offset })
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (!cancelled) setErrors(parseApiErrors(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [activeTab, tag, offset, user]);

  useEffect(() => {
    listTags().then((res) => setTags(res.tags)).catch(() => setTags([]));
  }, []);

  function selectTab(t: 'your' | 'global') {
    const next = new URLSearchParams(params);
    next.set('feed', t);
    next.delete('tag');
    next.delete('offset');
    setParams(next);
  }

  function selectTag(t: string) {
    const next = new URLSearchParams();
    next.set('tag', t);
    setParams(next);
  }

  function selectOffset(off: number) {
    const next = new URLSearchParams(params);
    if (off === 0) next.delete('offset');
    else next.set('offset', String(off));
    setParams(next);
  }

  return (
    <div className="home-page">
      <div className="banner">
        <div className="container">
          <h1 className="logo-font">conduit</h1>
          <p>A place to share your knowledge.</p>
        </div>
      </div>
      <div className="container page">
        <div className="row">
          <div className="col-md-9">
            <FeedTabs
              isAuthed={user !== null}
              activeTab={activeTab}
              tagName={tag}
              onSelect={selectTab}
            />
            <ErrorList errors={errors} />
            {loading && <p>Loading articles...</p>}
            {!loading && data.articles.length === 0 && <p>No articles are here... yet.</p>}
            {data.articles.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
            <Pagination total={data.articlesCount} limit={LIMIT} offset={offset} onSelect={selectOffset} />
          </div>
          <div className="col-md-3">
            <div className="sidebar">
              <p>Popular Tags</p>
              <TagList tags={tags} onSelect={selectTag} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
