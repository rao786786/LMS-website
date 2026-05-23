import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const AdminManageCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');

  const loadCourses = async () => {
    try {
      const { data } = await api.get('/courses');
      setCourses(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load courses');
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleDelete = async (id) => {
    await api.delete(`/courses/${id}`);
    loadCourses();
  };

  return (
    <div className="fade-up">
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
        <div>
          <div className="badge-soft text-bg-dark mb-2">Admin dashboard</div>
          <h2 className="section-title mb-1">Manage Courses</h2>
          <p className="section-subtitle mb-0">Monitor courses created by instructors and keep the platform tidy.</p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4">
        {courses.map((course) => (
          <div className="col-md-6" key={course._id}>
            <div className="card h-100 animated-card">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between gap-2 mb-2">
                  <span className="badge-soft text-bg-dark">{course.category}</span>
                  <span className="text-muted small">{course.lessons?.length || 0} lessons</span>
                </div>
                <h5 className="fw-bold">{course.title}</h5>
                <p className="text-muted mb-2">{course.description?.slice(0, 140)}{course.description?.length > 140 ? '...' : ''}</p>
                <small className="text-muted d-block mb-3">
                  Instructor: {course.instructor?.name || 'N/A'}
                </small>
                <div className="d-flex flex-wrap gap-2">
                  <Link className="btn btn-outline-primary btn-sm" to={`/courses/${course._id}`}>View</Link>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(course._id)}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!courses.length && (
        <div className="empty-state text-center">
          <h5 className="fw-bold">No courses available</h5>
          <p className="mb-0 text-muted">Courses will appear here once instructors create them.</p>
        </div>
      )}
    </div>
  );
};

export default AdminManageCoursesPage;
