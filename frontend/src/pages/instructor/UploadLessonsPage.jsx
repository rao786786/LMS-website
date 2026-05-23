import React, { useEffect, useMemo, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

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
      return `https://www.youtube.com/embed/${videoId}`;
    }

    if (parsed.hostname.includes('youtube.com')) {
      const videoId = parsed.searchParams.get('v');
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
  } catch (error) {
    return '';
  }
  return '';
};

const UploadLessonsPage = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [lessons, setLessons] = useState([{ title: '', content: '', videoUrl: '' }]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const { data } = await api.get('/courses');
      const visible = user?.role === 'admin'
        ? data
        : data.filter((course) => String(course.instructor?._id) === String(user?.id));

      setCourses(visible);
      setCourseId((prev) => prev || visible[0]?._id || '');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load courses');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const selectedCourse = useMemo(
    () => courses.find((course) => course._id === courseId) || null,
    [courses, courseId]
  );

  const updateLesson = (index, field, value) => {
    const copy = [...lessons];
    copy[index][field] = value;
    setLessons(copy);
  };

  const addLessonRow = () => setLessons([...lessons, { title: '', content: '', videoUrl: '' }]);

  const removeLessonRow = (index) => {
    if (lessons.length === 1) return;
    setLessons(lessons.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const cleanedLessons = lessons
        .map((lesson) => ({
          title: lesson.title.trim(),
          content: lesson.content.trim(),
          videoUrl: ensureUrl(lesson.videoUrl)
        }))
        .filter((lesson) => lesson.title);

      await api.put(`/courses/${courseId}/lessons`, { lessons: cleanedLessons });
      setMessage('Lessons uploaded successfully');
      setError('');
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save lessons');
    }
  };

  const previewLesson = lessons.find((lesson) => lesson.title.trim() || lesson.content.trim() || lesson.videoUrl.trim());

  const embed = previewLesson ? getYoutubeEmbedUrl(previewLesson.videoUrl) : '';

  return (
    <div className="fade-up">
      <div className="course-hero p-4 p-md-5 mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-lg-8">
            <div className="badge-soft mb-3">Lecture manager</div>
            <h2 className="section-title mb-2">Upload Lessons</h2>
            <p className="opacity-75 mb-0">Add lesson titles, content, and video links that students can open directly.</p>
          </div>
          <div className="col-lg-4 text-lg-end">
            <div className="stat-box d-inline-block">
              <div className="fs-4 fw-bold">{selectedCourse?.lessons?.length || 0}</div>
              <div>Saved lessons</div>
            </div>
          </div>
        </div>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!courses.length ? (
        <div className="empty-state text-center">
          <h5 className="fw-bold">No courses available</h5>
          <p className="mb-0 text-muted">Create a course first, then come back here to upload lessons.</p>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-7">
            <form onSubmit={handleSubmit} className="card p-4">
              <label className="form-label fw-semibold">Select Course</label>
              <select className="form-select mb-4" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>{course.title}</option>
                ))}
              </select>

              <h5 className="fw-bold mb-3">Lesson builder</h5>

              {lessons.map((lesson, index) => (
                <div key={index} className="border rounded-4 p-3 mb-3 bg-light">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <strong>Lesson {index + 1}</strong>
                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeLessonRow(index)}>
                      Remove
                    </button>
                  </div>

                  <input
                    className="form-control mb-2"
                    placeholder="Lesson Title"
                    value={lesson.title}
                    onChange={(e) => updateLesson(index, 'title', e.target.value)}
                  />
                  <textarea
                    className="form-control mb-2"
                    placeholder="Lesson Content"
                    rows="3"
                    value={lesson.content}
                    onChange={(e) => updateLesson(index, 'content', e.target.value)}
                  />
                  <input
                    className="form-control"
                    placeholder="Video URL"
                    value={lesson.videoUrl}
                    onChange={(e) => updateLesson(index, 'videoUrl', e.target.value)}
                  />
                </div>
              ))}

              <div className="d-flex flex-wrap gap-2">
                <button type="button" className="btn btn-outline-secondary" onClick={addLessonRow}>Add Another Lesson</button>
                <button className="btn btn-primary">Save Lessons</button>
              </div>
            </form>
          </div>

          <div className="col-lg-5">
            <div className="card h-100">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3">Live Preview</h5>
                {previewLesson ? (
                  <>
                    <div className="mb-3">
                      <div className="fw-semibold">{previewLesson.title || 'Untitled lesson'}</div>
                      <div className="text-muted small">{previewLesson.content || 'No content added yet.'}</div>
                    </div>
                    {embed ? (
                      <iframe className="video-frame" src={embed} title="lesson preview" allowFullScreen />
                    ) : previewLesson.videoUrl ? (
                      <a href={ensureUrl(previewLesson.videoUrl)} target="_blank" rel="noreferrer" className="btn btn-primary">
                        Open Lecture Link
                      </a>
                    ) : (
                      <div className="empty-state text-center">
                        <p className="mb-0 text-muted">Add a video URL to preview the lecture.</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="empty-state text-center">
                    <p className="mb-0 text-muted">Start typing a lesson to see a preview here.</p>
                  </div>
                )}

                {selectedCourse?.lessons?.length ? (
                  <div className="mt-4">
                    <h6 className="fw-bold mb-3">Already saved lessons</h6>
                    <div className="d-grid gap-2">
                      {selectedCourse.lessons.map((lesson) => (
                        <div key={lesson._id} className="lesson-pill p-3">
                          <div className="fw-semibold">{lesson.title}</div>
                          {lesson.videoUrl && (
                            <a href={ensureUrl(lesson.videoUrl)} target="_blank" rel="noreferrer" className="small">
                              Open saved lecture
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadLessonsPage;
