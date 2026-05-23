import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark site-navbar py-3 sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-4" to="/">
          LMS<span className="text-warning">.</span>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu" aria-controls="navMenu" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navMenu">
          <div className="navbar-nav ms-auto gap-2 align-items-lg-center">
            <NavLink className="nav-link" to="/">Home</NavLink>
            <NavLink className="nav-link" to="/about">About</NavLink>
            <NavLink className="nav-link" to="/courses">Courses</NavLink>

            {!isLoggedIn && (
              <>
                <NavLink className="nav-link" to="/login">Login</NavLink>
                <NavLink className="nav-link" to="/register">Register</NavLink>
              </>
            )}

            {isLoggedIn && (
              <>
                <span className="badge-soft ms-lg-2">Hi, {user?.name}</span>
                {user?.role === 'student' && <NavLink className="nav-link" to="/student/my-courses">Student Dashboard</NavLink>}
                {user?.role === 'instructor' && <NavLink className="nav-link" to="/instructor/manage-courses">Instructor Dashboard</NavLink>}
                {user?.role === 'admin' && <NavLink className="nav-link" to="/admin/users">Admin Dashboard</NavLink>}
                <button className="btn btn-sm btn-outline-light ms-lg-2" onClick={handleLogout}>Logout</button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
