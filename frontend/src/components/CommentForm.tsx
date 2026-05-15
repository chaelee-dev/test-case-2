import { useState, type FormEvent } from 'react';

interface Props {
  onSubmit: (body: string) => Promise<void>;
}

export function CommentForm({ onSubmit }: Props) {
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handle(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (body.trim().length === 0) return;
    setSubmitting(true);
    try {
      await onSubmit(body);
      setBody('');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="card comment-form" onSubmit={handle}>
      <div className="card-block">
        <textarea
          className="form-control"
          rows={3}
          placeholder="Write a comment..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          aria-label="Comment body"
        />
      </div>
      <div className="card-footer">
        <button className="btn btn-sm btn-primary" type="submit" disabled={submitting}>
          Post Comment
        </button>
      </div>
    </form>
  );
}
