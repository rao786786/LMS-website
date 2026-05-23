import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await register(form.name, form.email, form.password, form.role);
      const role = data.user.role;
      if (role === 'student') navigate('/student/my-courses');
      else if (role === 'instructor') navigate('/instructor/manage-courses');
      else navigate('/admin/users');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container page-shell" style={{ maxWidth: 980 }}>
      <div className="row g-4 align-items-stretch">
        <div className="col-lg-6 order-lg-2">
          <div className="hero-shell h-100 p-4 p-md-5 d-flex flex-column justify-content-between">
            <div>
              <div className="glow-pill mb-3">Create account</div>
              <h2 className="section-title mb-3 text-white">Join the LMS and start learning.</h2>
              <p className="opacity-75">
                Pick a role, create your profile, and jump into the dashboard that matches your assignment.
              </p>
            </div>
            <div className="row g-3 mt-4">
              <div className="col-6"><div className="stat-box"><div className="fw-bold">Courses</div><div className="small">Browse and enroll</div></div></div>
              <div className="col-6"><div className="stat-box"><div className="fw-bold">Lessons</div><div className="small">Track progress</div></div></div>
            </div>
          </div>
        </div>
        <div className="col-lg-6 order-lg-1">
          <div className="card p-4 p-md-5 fade-up h-100">
            <div className="badge-soft text-bg-dark mb-3">Create account</div>
            <h2 className="section-title mb-2">Register</h2>
            <p className="section-subtitle mb-4">Choose the role that matches your assignment testing.</p>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <input className="form-control mb-3" placeholder="Name" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input className="form-control mb-3" type="email" placeholder="Email" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <input className="form-control mb-3" type="password" placeholder="Password" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} />
              <select className="form-select mb-3" value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
              </select>
              <button className="btn btn-success w-100">Register</button>
              <p className="mt-3 mb-0 text-center">Already have an account? <Link to="/login">Login here</Link></p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
