import React from 'react';

const AboutPage = () => {
  return (
    <div className="container page-shell">
      <div className="card p-4 p-md-5 fade-up">
        <div className="row g-4 align-items-center">
          <div className="col-lg-7">
            <div className="badge-soft text-bg-dark mb-3">About the Project</div>
            <h2 className="section-title mb-3">A simple LMS built like a real product.</h2>
            <p className="section-subtitle mb-3">
              This project shows a full MERN workflow: authentication, dashboards, protected routes, course management,
              lesson uploads, and separate access for admin, instructor, and student users.
            </p>
            <p className="section-subtitle mb-0">
              The design uses strong colors, cards, and animated transitions so the website does not feel empty.
            </p>
          </div>
          <div className="col-lg-5">
            <div className="soft-card rounded-4 p-4">
              <h5 className="fw-bold mb-3">What it includes</h5>
              <ul className="mb-0 ps-3">
                <li>React Router pages</li>
                <li>MongoDB models with Mongoose</li>
                <li>JWT login and protected routes</li>
                <li>Role-based dashboards</li>
                <li>Clickable and embedded lecture links</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
