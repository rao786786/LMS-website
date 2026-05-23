const express = require('express');
const { getUsers, deleteUser, getAnalytics } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, authorize('admin'), getUsers);
router.delete('/:id', protect, authorize('admin'), deleteUser);
router.get('/analytics/summary', protect, authorize('admin'), getAnalytics);

module.exports = router;
