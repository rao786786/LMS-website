const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

const enrollInCourse = async (req, res) => {
  const { courseId } = req.body;
  if (!courseId) {
    return res.status(400).json({ message: 'courseId is required' });
  }

  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }

  const existing = await Enrollment.findOne({
    student: req.user._id,
    course: courseId
  });

  if (existing) {
    return res.status(200).json({ message: 'Already enrolled', enrollment: existing });
  }

  const enrollment = await Enrollment.create({
    student: req.user._id,
    course: courseId,
    progress: 0,
    completedLessons: []
  });

  res.status(201).json({ message: 'Enrolled successfully', enrollment });
};

const getMyCourses = async (req, res) => {
  const enrollments = await Enrollment.find({ student: req.user._id })
    .populate({
      path: 'course',
      populate: { path: 'instructor', select: 'name email role' }
    })
    .sort({ createdAt: -1 });

  res.json(enrollments);
};


const updateProgress = async (req, res) => {
  const { courseId } = req.params;
  const { lessonId } = req.body;

  if (!lessonId) {
    return res.status(400).json({ message: 'lessonId is required' });
  }

  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }

  const enrollment = await Enrollment.findOne({
    student: req.user._id,
    course: courseId
  });

  if (!enrollment) {
    return res.status(404).json({ message: 'You are not enrolled in this course' });
  }

  const lessonExists = course.lessons.some((lesson) => String(lesson._id) === String(lessonId));
  if (!lessonExists) {
    return res.status(404).json({ message: 'Lesson not found' });
  }

  const completed = new Set((enrollment.completedLessons || []).map(String));
  completed.add(String(lessonId));
  enrollment.completedLessons = Array.from(completed);

  const totalLessons = course.lessons.length || 0;
  enrollment.progress = totalLessons
    ? Math.min(100, Math.round((enrollment.completedLessons.length / totalLessons) * 100))
    : 0;

  await enrollment.save();

  const populated = await Enrollment.findById(enrollment._id).populate({
    path: 'course',
    populate: { path: 'instructor', select: 'name email role' }
  });

  res.json({
    message: 'Progress updated',
    enrollment: populated
  });
};

module.exports = { enrollInCourse, getMyCourses, updateProgress };
