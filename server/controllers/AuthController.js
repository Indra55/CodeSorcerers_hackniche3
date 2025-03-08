const User = require('../models/User');
const Admin = require('../models/Admin');
const Company = require('../models/Company');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User registration
exports.registerUser = async (req, res) => {
    try {
        // Log the request body to see what's being received
        console.log('Registration request body:', req.body);
        
        const { name, email, password } = req.body;
        
        // Check if required fields are present
        if (!name || !email || !password) {
            console.log('Missing required fields');
            return res.status(400).json({ message: 'All fields are required: name, email, password' });
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User already exists with email:', email);
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create new user
        const user = new User({ 
            name, 
            email, 
            password: hashedPassword 
        });
        
        // Save user to database
        await user.save();
        
        // Check if JWT_SECRET exists
        if (!process.env.JWT_SECRET) {
            console.log('JWT_SECRET environment variable is missing');
            return res.status(500).json({ message: 'Server configuration error' });
        }
        
        // Generate token
        const token = jwt.sign(
            { id: user._id, role: 'user' }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );
        
        console.log('User registered successfully:', user._id);
        res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        console.error('Registration error:', error);
        
        // Check for specific error types
        if (error.name === 'ValidationError') {
            // MongoDB validation error
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: 'Validation error', errors });
        } else if (error.code === 11000) {
            // Duplicate key error (usually email)
            return res.status(400).json({ message: 'Email already in use' });
        }
        
        res.status(500).json({ message: 'Server error during registration', error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        console.log("Login request received:", req.body); // Log incoming request

        const { email, password } = req.body;

        if (!email || !password) {
            console.log("Missing email or password");
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            console.log(`User not found for email: ${email}`);
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log(`Password mismatch for user: ${email}`);
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user._id, role: "user" }, process.env.JWT_SECRET, { expiresIn: "1h" });

        console.log(`User authenticated: ${email}, Token generated`);
        res.status(200).json({ userId: user._id, token });

    } catch (error) {
        console.error("Error in loginUser:", error.message);
        res.status(500).json({ error: error.message });
    }
};

exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ adminId: admin._id, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.loginCompany = async (req, res) => {
    try {
        const { email, password } = req.body;
        const company = await Company.findOne({ email });
        if (!company) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, company.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ id: company._id, role: 'company' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ companyId: company._id, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

