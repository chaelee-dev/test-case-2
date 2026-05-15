import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer>
      <div className="container">
        <Link to="/" className="logo-font">
          conduit
        </Link>
        <span className="attribution">
          An interactive learning project from <a href="https://realworld.io">RealWorld</a>.
        </span>
      </div>
    </footer>
  );
}
