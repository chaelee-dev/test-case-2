import { Link } from 'react-router-dom';
import type { Comment } from '../types/domain.js';
import { renderMarkdown } from '../markdown/render.js';

interface Props {
  comment: Comment;
  canDelete: boolean;
  onDelete: (id: number) => void;
}

export function CommentItem({ comment, canDelete, onDelete }: Props) {
  const html = renderMarkdown(comment.body);
  return (
    <div className="card">
      <div className="card-block" dangerouslySetInnerHTML={{ __html: html }} />
      <div className="card-footer">
        <Link to={`/profile/${comment.author.username}`} className="comment-author">
          {comment.author.username}
        </Link>
        <span className="date-posted">{new Date(comment.createdAt).toDateString()}</span>
        {canDelete && (
          <button
            type="button"
            className="btn btn-sm btn-outline-danger mod-options"
            onClick={() => onDelete(comment.id)}
            aria-label="Delete comment"
          >
            <i className="ion-trash-a" />
          </button>
        )}
      </div>
    </div>
  );
}
