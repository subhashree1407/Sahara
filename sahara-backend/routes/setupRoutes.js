const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Admin = require('../models/admin.model'); // Import Admin model correctly

// @desc    Create initial admin user
// @route   POST /api/setup/create-admin
// @access  Public (Run once)
const createAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if admin already exists
        const adminExists = await Admin.findOne({ role: 'admin' });

        if (adminExists) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create admin user
        const adminUser = new Admin({
            name,
            email,
            password: hashedPassword,
            role: 'admin',
        });

        await adminUser.save();

        res.status(201).json({ message: 'Admin created successfully' });
    } catch (error) {
        console.error('Error creating admin:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

router.post('/create-admin', createAdmin);

module.exports = router;
