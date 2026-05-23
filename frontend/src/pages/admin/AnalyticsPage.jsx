import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const AnalyticsPage = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/users/analytics/summary');
        setStats(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load analytics');
      }
    };
    load();
  }, []);

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!stats) {
    return <div className="empty-state text-center">Loading analytics...</div>;
  }

  const cards = [
    { label: 'Total Users', value: stats.usersCount },
    { label: 'Total Courses', value: stats.coursesCount },
    { label: 'Total Enrollments', value: stats.enrollmentsCount },
    { label: 'Students', value: stats.studentsCount },
    { label: 'Instructors', value: stats.instructorsCount }
  ];

  return (
    <div className="fade-up">
      <div className="badge-soft text-bg-dark mb-2">Admin reports</div>
      <h2 className="section-title mb-4">Reports / Analytics</h2>

      <div className="row g-4">
        {cards.map((item) => (
          <div className="col-md-4" key={item.label}>
            <div className="card h-100 animated-card">
              <div className="card-body p-4">
                <div className="mini-label mb-2">{item.label}</div>
                <div className="display-6 fw-bold text-gradient">{item.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsPage;
