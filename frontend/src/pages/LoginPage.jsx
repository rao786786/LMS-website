import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(form.email, form.password);
      const role = data.user.role;
      if (role === 'student') navigate('/student/my-courses');
      else if (role === 'instructor') navigate('/instructor/manage-courses');
      else navigate('/admin/users');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container page-shell" style={{ maxWidth: 980 }}>
      <div className="row g-4 align-items-stretch">
        <div className="col-lg-6">
          <div className="hero-shell h-100 p-4 p-md-5 d-flex flex-column justify-content-between">
            <div>
              <div className="glow-pill mb-3">Secure access</div>
              <h2 className="section-title mb-3 text-white">Welcome back to your learning space.</h2>
              <p className="opacity-75">
                Sign in to continue managing courses, lessons, and your dashboard progress.
              </p>
            </div>
            <div className="row g-3 mt-4">
              <div className="col-6"><div className="stat-box"><div className="fw-bold">JWT</div><div className="small">Protected login</div></div></div>
              <div className="col-6"><div className="stat-box"><div className="fw-bold">3 Roles</div><div className="small">Student, Instructor, Admin</div></div></div>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card p-4 p-md-5 fade-up h-100">
            <div className="badge-soft text-bg-dark mb-3">Welcome back</div>
            <h2 className="section-title mb-2">Login</h2>
            <p className="section-subtitle mb-4">Use your account to access your dashboard.</p>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <input className="form-control mb-3" type="email" placeholder="Email" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <input className="form-control mb-3" type="password" placeholder="Password" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} />
              <button className="btn btn-primary w-100">Login</button>
              <p className="mt-3 mb-0 text-center">No account? <Link to="/register">Register here</Link></p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
