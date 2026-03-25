const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Patient = require('../models/patient.model');
const Doctor = require('../models/doctor.model');
const Lab = require('../models/lab.model');
const Admin = require('../models/admin.model');

// Register a new patient
const registerPatient = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await Patient.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new Patient({
            name,
            email,
            password: hashedPassword,
            role: 'patient',
        });

        await user.save();

        res.status(201).json({ message: 'Patient registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user across all collections
        let user = await Patient.findOne({ email });
        if (!user) {
            user = await Doctor.findOne({ email });
        }
        if (!user) {
            user = await Lab.findOne({ email });
        }
        if (!user) {
            user = await Admin.findOne({ email });
        }

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create token
        const payload = {
            id: user._id,
            role: user.role,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        res.status(200).json({
            token,
            role: user.role,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    registerPatient,
    loginUser,
};
