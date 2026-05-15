import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { deleteArticle, favoriteArticle, getArticle, unfavoriteArticle } from '../api/endpoints/articles.js';
import { parseApiErrors } from '../api/parseErrors.js';
import { renderMarkdown } from '../markdown/render.js';
import { ErrorList } from '../components/ErrorList.js';
import type { Article } from '../types/domain.js';
import { useAuth } from '../auth/useAuth.js';

export function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getArticle(slug)
      .then((res) => setArticle(res.article))
      .catch((err) => setErrors(parseApiErrors(err)))
      .finally(() => setLoading(false));
  }, [slug]);

  async function toggleFavorite() {
    if (!article || !user) return;
    try {
      const fn = article.favorited ? unfavoriteArticle : favoriteArticle;
      const res = await fn(article.slug);
      setArticle(res.article);
    } catch (err) {
      setErrors(parseApiErrors(err));
    }
  }

  async function onDelete() {
    if (!article) return;
    if (!window.confirm('Delete this article?')) return;
    try {
      await deleteArticle(article.slug);
      navigate('/');
    } catch (err) {
      setErrors(parseApiErrors(err));
    }
  }

  if (loading) return <div className="container">Loading...</div>;
  if (!article) {
    return (
      <div className="container">
        <ErrorList errors={errors.length > 0 ? errors : ['article not found']} />
      </div>
    );
  }

  const html = renderMarkdown(article.body ?? '');

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{article.title}</h1>
          <div className="article-meta">
            <Link to={`/profile/${article.author.username}`}>
              <span className="author">{article.author.username}</span>
            </Link>
            <span className="date">{new Date(article.createdAt).toDateString()}</span>
            {user && (
              <button
                type="button"
                className={`btn btn-sm ${article.favorited ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={toggleFavorite}
                aria-label={article.favorited ? 'Unfavorite' : 'Favorite'}
              >
                <i className="ion-heart" /> {article.favorited ? 'Unfavorite' : 'Favorite'} ({article.favoritesCount})
              </button>
            )}
            {user && user.username === article.author.username && (
              <>
                <Link to={`/editor/${article.slug}`} className="btn btn-sm btn-outline-secondary">
                  <i className="ion-edit" /> Edit article
                </Link>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={onDelete}
                  aria-label="Delete article"
                >
                  <i className="ion-trash-a" /> Delete article
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="container page">
        <ErrorList errors={errors} />
        <div className="row article-content">
          <div className="col-md-12" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
        <hr />
        <ul className="tag-list">
          {article.tagList.map((t) => (
            <li key={t} className="tag-default tag-pill tag-outline">
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
