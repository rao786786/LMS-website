const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

const getUsers = async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
};

const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  await Course.deleteMany({ instructor: user._id });
  await Enrollment.deleteMany({ student: user._id });
  await user.deleteOne();

  res.json({ message: 'User deleted successfully' });
};

const getAnalytics = async (req, res) => {
  const [usersCount, coursesCount, enrollmentsCount, studentsCount, instructorsCount] = await Promise.all([
    User.countDocuments(),
    Course.countDocuments(),
    Enrollment.countDocuments(),
    User.countDocuments({ role: 'student' }),
    User.countDocuments({ role: 'instructor' })
  ]);

  res.json({
    usersCount,
    coursesCount,
    enrollmentsCount,
    studentsCount,
    instructorsCount
  });
};

module.exports = { getUsers, deleteUser, getAnalytics };
