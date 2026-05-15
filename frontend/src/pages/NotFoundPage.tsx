import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="container">
      <h1>404 — Not Found</h1>
      <p>
        <Link to="/">Back to home</Link>
      </p>
    </div>
  );
}
