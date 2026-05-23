const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

const getCourses = async (req, res) => {
  const courses = await Course.find().populate('instructor', 'name email role').sort({ createdAt: -1 });
  res.json(courses);
};

const getCourseById = async (req, res) => {
  const course = await Course.findById(req.params.id).populate('instructor', 'name email role');
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }
  res.json(course);
};

const createCourse = async (req, res) => {
  const { title, description, category, price, imageUrl } = req.body;
  if (!title || !description || !category) {
    return res.status(400).json({ message: 'Title, description and category are required' });
  }

  const course = await Course.create({
    title,
    description,
    category,
    price: price || 0,
    imageUrl: imageUrl || '',
    instructor: req.user._id
  });

  res.status(201).json(course);
};

const updateCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }

  const isOwner = course.instructor.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';
  if (!isOwner && !isAdmin) {
    return res.status(403).json({ message: 'Not allowed to edit this course' });
  }

  const { title, description, category, price, imageUrl, lessons } = req.body;
  if (title !== undefined) course.title = title;
  if (description !== undefined) course.description = description;
  if (category !== undefined) course.category = category;
  if (price !== undefined) course.price = price;
  if (imageUrl !== undefined) course.imageUrl = imageUrl;
  if (Array.isArray(lessons)) course.lessons = lessons;

  const updated = await course.save();
  res.json(updated);
};

const deleteCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }

  const isOwner = course.instructor.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';
  if (!isOwner && !isAdmin) {
    return res.status(403).json({ message: 'Not allowed to delete this course' });
  }

  await Enrollment.deleteMany({ course: course._id });
  await course.deleteOne();

  res.json({ message: 'Course deleted successfully' });
};

const addLessons = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }

  const isOwner = course.instructor.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';
  if (!isOwner && !isAdmin) {
    return res.status(403).json({ message: 'Not allowed to update lessons' });
  }

  const { lessons } = req.body;
  if (!Array.isArray(lessons)) {
    return res.status(400).json({ message: 'Lessons must be an array' });
  }

  course.lessons = lessons;
  const updated = await course.save();
  res.json(updated);
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  addLessons
};
