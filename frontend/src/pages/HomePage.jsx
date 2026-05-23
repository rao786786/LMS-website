import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="container page-shell">
      <section className="hero-shell p-4 p-md-5">
        <div className="hero-inner row align-items-center g-4">
          <div className="col-lg-7">
            <div className="glow-pill mb-3 fade-up">
              <span>✨</span>
              <span>Modern MERN Learning Platform</span>
            </div>
            <h1 className="display-4 fw-bold mb-3 fade-up delay-1">
              Learn, teach, and manage courses in one <span className="text-warning">smart</span> system.
            </h1>
            <p className="lead mb-4 fade-up delay-2" style={{ maxWidth: 680 }}>
              Students can enroll in courses, instructors can upload lessons with lecture links, and admins can manage users and analytics from a clean dashboard.
            </p>
            <div className="d-flex flex-wrap gap-3 fade-up delay-3">
              <Link to="/courses" className="btn btn-light btn-lg px-4">Browse Courses</Link>
              <Link to="/register" className="btn btn-outline-light btn-lg px-4">Create Account</Link>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="soft-card rounded-4 p-4 floating">
              <div className="row g-3">
                <div className="col-6">
                  <div className="stat-box">
                    <div className="fs-3 fw-bold">3</div>
                    <div>Roles</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="stat-box">
                    <div className="fs-3 fw-bold">JWT</div>
                    <div>Secure Login</div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="stat-box">
                    <div className="fs-5 fw-semibold">Lecture viewer included</div>
                    <div className="opacity-75">Open lesson links directly or watch embedded previews.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="text-center mb-4">
          <div className="mini-label fw-semibold text-uppercase">Why this platform</div>
          <h2 className="section-title">Built for real classroom flow</h2>
          <p className="section-subtitle mx-auto">
            The interface is designed to feel complete, colorful, and easy to use on both desktop and mobile.
          </p>
        </div>

        <div className="row g-4">
          {[
            { title: 'Students', text: 'Register, browse courses, enroll, and track your enrolled learning path.' },
            { title: 'Instructors', text: 'Create courses, upload lessons, and attach lecture links your learners can open.' },
            { title: 'Admins', text: 'Manage users, manage courses, and review quick analytics from the dashboard.' }
          ].map((item, index) => (
            <div className="col-md-4" key={item.title}>
              <div className="card h-100 animated-card fade-up" style={{ animationDelay: `${index * 0.12}s` }}>
                <div className="card-body p-4">
                  <div className="badge-soft mb-3 text-bg-dark">{item.title}</div>
                  <h5 className="fw-bold">{item.title} Dashboard</h5>
                  <p className="text-muted mb-0">{item.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-2 py-md-4">
        <div className="card course-hero p-4 p-md-5">
          <div className="row align-items-center g-4">
            <div className="col-lg-8">
              <h2 className="section-title mb-3">Everything the assignment asked for, in one project.</h2>
              <p className="mb-0 opacity-75">
                React frontend, Node/Express backend, MongoDB models, REST APIs, JWT auth, role-based routes, lecture uploads, and polished UI sections.
              </p>
            </div>
            <div className="col-lg-4 text-lg-end">
              <Link to="/courses" className="btn btn-light btn-lg px-4">See Courses</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
