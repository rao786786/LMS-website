import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const ensureUrl = (url = '') => {
  const value = url.trim();
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
};

const getYoutubeEmbedUrl = (url = '') => {
  try {
    const normalized = ensureUrl(url);
    const parsed = new URL(normalized);

    if (parsed.hostname.includes('youtu.be')) {
      const videoId = parsed.pathname.replace('/', '');
      return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
    }

    if (parsed.hostname.includes('youtube.com')) {
      const videoId = parsed.searchParams.get('v');
      if (videoId) return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
    }
  } catch (error) {
    return '';
  }
  return '';
};

const LessonPreview = ({ lesson, onWatched, canTrackProgress }) => {
  if (!lesson) {
    return (
      <div className="empty-state h-100 d-flex align-items-center justify-content-center text-center">
        <div>
          <h5 className="fw-bold mb-2">Select a lesson</h5>
          <p className="mb-0 text-muted">Choose a lecture from the list to preview it here.</p>
        </div>
      </div>
    );
  }

  const link = ensureUrl(lesson.videoUrl);
  const embedUrl = getYoutubeEmbedUrl(link);

  return (
    <div className="course-preview card h-100">
      <div className="card-body p-4 p-md-5">
        <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
          <div>
            <div className="badge-soft text-bg-dark mb-2">Lecture Preview</div>
            <h4 className="fw-bold mb-1">{lesson.title}</h4>
            {lesson.content && <p className="text-muted mb-0">{lesson.content}</p>}
          </div>
          {canTrackProgress && (
            <span className="badge rounded-pill text-bg-success-subtle text-success border border-success-subtle px-3 py-2">
              Progress tracking enabled
            </span>
          )}
        </div>

        {embedUrl ? (
          <iframe
            className="video-frame"
            src={embedUrl}
            title={lesson.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : link ? (
          <video
            className="video-frame"
            controls
            src={link}
            onEnded={() => canTrackProgress && onWatched?.(lesson)}
          />
        ) : (
          <div className="empty-state text-center">
            <h6 className="fw-bold">No lecture link was added</h6>
            <p className="mb-0 text-muted">The lesson still shows content, but no video URL was saved.</p>
          </div>
        )}

        {link && (
          <div className="d-flex flex-wrap gap-2 mt-3">
            <a className="btn btn-primary" href={link} target="_blank" rel="noreferrer">
              Open Lecture Link
            </a>
            {canTrackProgress && (
              <button className="btn btn-outline-primary" onClick={() => onWatched?.(lesson)}>
                Mark as watched
              </button>
            )}
          </div>
        )}

        <div className="mt-4 p-3 p-md-4 rounded-4 info-banner">
          <div className="fw-semibold mb-1">Need a little progress boost?</div>
          <div className="small text-muted">
            Your course progress updates when you finish a lesson video. For streamed lessons, use the watched button after viewing.
          </div>
        </div>
      </div>
    </div>
  );
};

const CourseDetailPage = () => {
  const { id } = useParams();
  const { user, isLoggedIn } = useAuth();
  const [course, setCourse] = useState(null);
  const [message, setMessage] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [enrollment, setEnrollment] = useState(null);
  const [loadingEnrollment, setLoadingEnrollment] = useState(false);

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const { data } = await api.get(`/courses/${id}`);
        setCourse(data);
        setSelectedIndex(0);
      } catch (error) {
        setMessage(error.response?.data?.message || 'Unable to load course');
      }
    };
    loadCourse();
  }, [id]);

  useEffect(() => {
    const loadEnrollment = async () => {
      if (!isLoggedIn || user?.role !== 'student') {
        setEnrollment(null);
        return;
      }

      try {
        setLoadingEnrollment(true);
        const { data } = await api.get('/enrollments/my-courses');
        const match = data.find((item) => String(item.course?._id) === String(id));
        setEnrollment(match || null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingEnrollment(false);
      }
    };

    loadEnrollment();
  }, [id, isLoggedIn, user?.role]);

  const selectedLesson = useMemo(() => {
    if (!course?.lessons?.length) return null;
    return course.lessons[selectedIndex] || course.lessons[0] || null;
  }, [course, selectedIndex]);

  const completedLessons = enrollment?.completedLessons || [];
  const progress = enrollment?.progress || 0;
  const isStudent = isLoggedIn && user?.role === 'student';
  const isEnrolled = !!enrollment;

  const handleEnroll = async () => {
    try {
      const { data } = await api.post('/enrollments', { courseId: id });
      setMessage(data.message || 'Enrolled');
      const refreshed = await api.get('/enrollments/my-courses');
      const match = refreshed.data.find((item) => String(item.course?._id) === String(id));
      setEnrollment(match || null);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Something went wrong');
    }
  };

  const handleWatched = async (lesson) => {
    try {
      if (!isEnrolled) {
        setMessage('Enroll first to track lesson progress.');
        return;
      }

      const { data } = await api.patch(`/enrollments/${id}/progress`, {
        lessonId: lesson._id
      });

      setEnrollment(data.enrollment);
      setMessage(data.message || 'Progress updated');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to update progress');
    }
  };

  if (!course) {
    return (
      <div className="container page-shell">
        <div className="empty-state text-center">
          <div className="fw-bold fs-4 mb-2">Loading course...</div>
          <p className="mb-0 text-muted">Please wait while the lesson details load.</p>
        </div>
      </div>
    );
  }

  const totalLessons = course.lessons?.length || 0;
  const completedCount = completedLessons.length;

  return (
    <div className="container page-shell">
      <div className="course-hero p-4 p-md-5 mb-4">
        <div className="row align-items-center g-4">
          <div className="col-lg-8">
            <div className="badge-soft mb-3">Course detail</div>
            <h2 className="section-title mb-2">{course.title}</h2>
            <p className="opacity-75 mb-3">{course.description}</p>
            <div className="d-flex flex-wrap gap-2">
              <span className="badge-soft">Category: {course.category}</span>
              <span className="badge-soft">Instructor: {course.instructor?.name || 'N/A'}</span>
              <span className="badge-soft">Price: Rs. {course.price}</span>
              <span className="badge-soft">{totalLessons} lessons</span>
            </div>
          </div>
          <div className="col-lg-4 text-lg-end">
            {isStudent && !isEnrolled && (
              <button className="btn btn-light btn-lg px-4" onClick={handleEnroll}>Enroll Now</button>
            )}

            {isEnrolled && (
              <div className="progress-card ms-lg-auto">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-semibold">Your progress</span>
                  <span className="fw-bold">{progress}%</span>
                </div>
                <div className="progress progress-soft" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
                  <div className="progress-bar progress-bar-striped progress-bar-animated" style={{ width: `${progress}%` }} />
                </div>
                <div className="small opacity-75 mt-2">
                  {completedCount} of {totalLessons} lessons completed
                </div>
              </div>
            )}

            {isStudent && loadingEnrollment && (
              <div className="small opacity-75 mt-3">Loading your progress...</div>
            )}
          </div>
        </div>
      </div>

      {message && <div className="alert alert-info rounded-4 shadow-sm">{message}</div>}

      <div className="row g-4 align-items-stretch">
        <div className="col-lg-4">
          <div className="card h-100 course-lessons-panel">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-bold mb-0">Lessons</h4>
                <span className="mini-label">{completedCount}/{totalLessons} done</span>
              </div>

              {course.lessons?.length ? (
                <div className="d-grid gap-3">
                  {course.lessons.map((lesson, index) => {
                    const link = ensureUrl(lesson.videoUrl);
                    const watched = completedLessons.includes(String(lesson._id));
                    return (
                      <button
                        key={lesson._id}
                        className={`lesson-pill text-start p-3 border-0 ${selectedIndex === index ? 'shadow-sm active-lesson' : ''}`}
                        onClick={() => setSelectedIndex(index)}
                      >
                        <div className="d-flex justify-content-between gap-2 align-items-center">
                          <strong className="me-2">{lesson.title}</strong>
                          <span className={`lesson-status ${watched ? 'watched' : link ? 'ready' : 'text'}`}>
                            {watched ? 'Watched' : link ? 'Watch' : 'Text'}
                          </span>
                        </div>
                        {lesson.content && <div className="small text-muted mt-2">{lesson.content}</div>}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-state text-center">
                  <h6 className="fw-bold">No lessons uploaded yet</h6>
                  <p className="mb-0 text-muted">When the instructor adds lectures, they will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <LessonPreview
            lesson={selectedLesson}
            onWatched={handleWatched}
            canTrackProgress={isEnrolled}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
