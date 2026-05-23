const express = require('express');
const { enrollInCourse, getMyCourses, updateProgress } = require('../controllers/enrollmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('student'), enrollInCourse);
router.get('/my-courses', protect, authorize('student'), getMyCourses);
router.patch('/:courseId/progress', protect, authorize('student'), updateProgress);

module.exports = router;
