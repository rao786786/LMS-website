import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="container page-shell">
      <div className="empty-state text-center">
        <h2 className="fw-bold mb-2">Page not found</h2>
        <p className="text-muted mb-4">The page you tried to open does not exist.</p>
        <Link to="/" className="btn btn-primary">Go Home</Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
