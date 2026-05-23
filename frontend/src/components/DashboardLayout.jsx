import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {
  const { user } = useAuth();
  const location = useLocation();

  const links = {
    student: [
      { to: '/student/my-courses', label: 'My Courses' },
      { to: '/student/profile', label: 'Profile' }
    ],
    instructor: [
      { to: '/instructor/create-course', label: 'Create Course' },
      { to: '/instructor/manage-courses', label: 'Manage Courses' },
      { to: '/instructor/upload-lessons', label: 'Upload Lessons' }
    ],
    admin: [
      { to: '/admin/users', label: 'Manage Users' },
      { to: '/admin/courses', label: 'Manage Courses' },
      { to: '/admin/analytics', label: 'Reports / Analytics' }
    ]
  };

  const menu = links[user?.role] || [];

  return (
    <div className="container dashboard-shell">
      <div className="row g-4">
        <aside className="col-lg-3">
          <div className="dashboard-sidebar fade-up">
            <div className="mb-4">
              <div className="badge-soft mb-2">{user?.role?.toUpperCase() || 'USER'} AREA</div>
              <h4 className="mb-1">{user?.name}</h4>
              <p className="mb-0 text-white-50">Welcome back to your learning workspace.</p>
            </div>

            <div className="list-group">
              {menu.map((item) => {
                const active = location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`list-group-item list-group-item-action ${active ? 'active' : ''}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </aside>

        <main className="col-lg-9 dashboard-main">
          <div className="fade-up">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
