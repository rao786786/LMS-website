import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  const image = course.imageUrl?.trim();
  const lessonCount = course.lessons?.length || 0;

  return (
    <div className="card h-100 animated-card course-card">
      <div
        className="course-thumb d-flex align-items-end p-4"
        style={image ? {
          backgroundImage: `linear-gradient(180deg, rgba(13, 18, 32, 0.08), rgba(13, 18, 32, 0.78)), url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : {}}
      >
        <div>
          <span className="badge-soft bg-white text-dark mb-2">{course.category}</span>
          <h5 className="mb-0 fw-bold">{course.title}</h5>
        </div>
      </div>
      <div className="card-body d-flex flex-column p-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <p className="text-muted small mb-0">
            {course.instructor?.name ? `Instructor: ${course.instructor.name}` : 'Instructor details available after login'}
          </p>
          <span className="mini-label">{lessonCount} lessons</span>
        </div>
        <p className="card-text flex-grow-1 text-muted">
          {course.description?.length > 120 ? `${course.description.slice(0, 120)}...` : course.description}
        </p>
        <div className="d-flex justify-content-between align-items-center mt-2">
          <strong className="text-gradient">Rs. {course.price}</strong>
          <Link className="btn btn-primary btn-sm" to={`/courses/${course._id}`}>View Details</Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
