import { Link } from 'react-router-dom';
import type { Article } from '../types/domain.js';

interface Props {
  article: Article;
}

export function ArticleCard({ article }: Props) {
  return (
    <div className="article-preview">
      <div className="article-meta">
        <Link to={`/profile/${article.author.username}`}>
          {article.author.image && <img src={article.author.image} alt="" />}
        </Link>
        <div className="info">
          <Link to={`/profile/${article.author.username}`} className="author">
            {article.author.username}
          </Link>
          <span className="date">{new Date(article.createdAt).toDateString()}</span>
        </div>
        <button
          className={`btn btn-sm pull-xs-right ${article.favorited ? 'btn-primary' : 'btn-outline-primary'}`}
          type="button"
          aria-label={article.favorited ? 'Unfavorite' : 'Favorite'}
        >
          <i className="ion-heart" /> {article.favoritesCount}
        </button>
      </div>
      <Link to={`/article/${article.slug}`} className="preview-link">
        <h1>{article.title}</h1>
        <p>{article.description}</p>
        <span>Read more...</span>
        <ul className="tag-list">
          {article.tagList.map((t) => (
            <li key={t} className="tag-default tag-pill tag-outline">
              {t}
            </li>
          ))}
        </ul>
      </Link>
    </div>
  );
}
