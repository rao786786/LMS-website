import React from 'react';
import { useAuth } from '../../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="card p-4 p-md-5 fade-up">
      <div className="badge-soft text-bg-dark mb-3">Student profile</div>
      <h2 className="section-title mb-3">Profile</h2>
      <div className="row g-3">
        <div className="col-md-4">
          <div className="soft-card rounded-4 p-3">
            <div className="mini-label">Name</div>
            <div className="fw-semibold">{user?.name}</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="soft-card rounded-4 p-3">
            <div className="mini-label">Email</div>
            <div className="fw-semibold">{user?.email}</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="soft-card rounded-4 p-3">
            <div className="mini-label">Role</div>
            <div className="fw-semibold">{user?.role}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
