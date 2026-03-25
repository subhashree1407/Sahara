const Admin = require('../models/admin.model');
const Doctor = require('../models/doctor.model');
const Patient = require('../models/patient.model');
const Lab = require('../models/lab.model');
const bcrypt = require('bcryptjs');

// @desc    Create a new Doctor
// @access  Private (Admin only)
const createDoctor = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await Doctor.findOne({ email }) || 
                           await Patient.findOne({ email }) || 
                           await Lab.findOne({ email }) || 
                           await Admin.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const doctor = new Doctor({
            name,
            email,
            password: hashedPassword,
            role: 'doctor',
        });

        await doctor.save();
        res.status(201).json({ message: 'Doctor created successfully' });
    } catch (error) {
        console.error('Error creating doctor:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create a new Lab Technician
// @access  Private (Admin only)
const createLab = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await Doctor.findOne({ email }) || 
                           await Patient.findOne({ email }) || 
                           await Lab.findOne({ email }) || 
                           await Admin.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const lab = new Lab({
            name,
            email,
            password: hashedPassword,
            role: 'lab',
        });

        await lab.save();
        res.status(201).json({ message: 'Lab Technician created successfully' });
    } catch (error) {
        console.error('Error creating lab technician:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all users
// @access  Private (Admin only)
const getAllUsers = async (req, res) => {
    try {
        const doctors = await Doctor.find().select('-password');
        const patients = await Patient.find().select('-password');
        const labs = await Lab.find().select('-password');
        const admins = await Admin.find().select('-password');
        
        const users = [...doctors, ...patients, ...labs, ...admins].sort((a, b) => b.createdAt - a.createdAt);
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a user
// @access  Private (Admin only)
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.query;

        if (!role) {
            return res.status(400).json({ message: 'Role is required to delete' });
        }

        let user;
        if (role === 'doctor') user = await Doctor.findByIdAndDelete(id);
        else if (role === 'patient') user = await Patient.findByIdAndDelete(id);
        else if (role === 'lab') user = await Lab.findByIdAndDelete(id);
        else if (role === 'admin') user = await Admin.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createDoctor,
    createLab,
    getAllUsers,
    deleteUser,
};
