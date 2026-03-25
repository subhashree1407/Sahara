const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { createDoctor, createLab, getAllUsers, deleteUser } = require('../controllers/adminController');

// @route   POST /api/admin/create-doctor
router.post('/create-doctor', protect, authorize('admin'), createDoctor);

// @route   POST /api/admin/create-lab
router.post('/create-lab', protect, authorize('admin'), createLab);

// @route   GET /api/admin/users
router.get('/users', protect, authorize('admin'), getAllUsers);

// @route   DELETE /api/admin/users/:id
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
