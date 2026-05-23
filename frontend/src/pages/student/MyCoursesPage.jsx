import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const MyCoursesPage = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const { data } = await api.get('/enrollments/my-courses');
      setItems(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load enrolled courses');
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="fade-up">
      <div className="course-hero p-4 p-md-5 mb-4">
        <div className="row align-items-end g-3">
          <div className="col-lg-8">
            <div className="badge-soft mb-3">Student dashboard</div>
            <h2 className="section-title mb-1">My Courses</h2>
            <p className="opacity-75 mb-0">Continue learning from your enrolled courses and see your progress move up as you finish lessons.</p>
          </div>
          <div className="col-lg-4 text-lg-end">
            <div className="stat-box d-inline-block">
              <div className="fs-2 fw-bold">{items.length}</div>
              <div>Enrolled Courses</div>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4">
        {items.map((item) => (
          <div className="col-md-6" key={item._id}>
            <div className="card h-100 animated-card course-progress-card">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between gap-2 mb-2 align-items-center">
                  <span className="badge-soft text-bg-dark">{item.course?.category}</span>
                  <span className="lesson-status watched">{item.progress}%</span>
                </div>
                <h5 className="fw-bold mb-2">{item.course?.title}</h5>
                <p className="text-muted mb-3">{item.course?.description}</p>

                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <small className="text-muted">Course progress</small>
                    <small className="fw-semibold">{item.completedLessons?.length || 0} lessons completed</small>
                  </div>
                  <div className="progress progress-soft">
                    <div
                      className="progress-bar progress-bar-striped progress-bar-animated"
                      style={{ width: `${item.progress || 0}%` }}
                    />
                  </div>
                </div>

                <div className="d-flex gap-2 flex-wrap">
                  <Link to={`/courses/${item.course?._id}`} className="btn btn-primary btn-sm">
                    Open Course
                  </Link>
                  <span className="btn btn-outline-secondary btn-sm disabled">
                    {item.course?.lessons?.length || 0} lessons
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!items.length && (
        <div className="empty-state text-center mt-4">
          <h5 className="fw-bold">You are not enrolled in any course yet.</h5>
          <p className="mb-0 text-muted">Browse courses and enroll to start learning.</p>
        </div>
      )}
    </div>
  );
};

export default MyCoursesPage;
