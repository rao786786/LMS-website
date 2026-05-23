import React, { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import CourseCard from '../components/CourseCard';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await api.get('/courses');
        setCourses(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return courses;
    return courses.filter((course) => {
      return [
        course.title,
        course.description,
        course.category,
        course.instructor?.name
      ].filter(Boolean).some((value) => value.toLowerCase().includes(term));
    });
  }, [courses, query]);

  if (loading) {
    return (
      <div className="container page-shell">
        <div className="empty-state text-center">
          <div className="fw-bold fs-4 mb-2">Loading courses...</div>
          <p className="mb-0 text-muted">Fetching the latest course list.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container page-shell">
      <div className="course-hero p-4 p-md-5 mb-4">
        <div className="row align-items-end g-3">
          <div className="col-lg-8">
            <div className="badge-soft mb-3">Explore learning paths</div>
            <h2 className="section-title mb-2">Course Listing</h2>
            <p className="opacity-75 mb-0">
              Search by title, category, instructor, or description.
            </p>
          </div>
          <div className="col-lg-4 text-lg-end">
            <div className="stat-box d-inline-block">
              <div className="fs-2 fw-bold">{filteredCourses.length}</div>
              <div>Available Courses</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <input
          className="form-control form-control-lg input-glow"
          placeholder="Search courses..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {filteredCourses.length ? (
        <div className="row g-4">
          {filteredCourses.map((course) => (
            <div key={course._id} className="col-md-6 col-lg-4">
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state text-center">
          <h5 className="fw-bold mb-2">No matching courses found</h5>
          <p className="mb-0 text-muted">Try a different search term.</p>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
