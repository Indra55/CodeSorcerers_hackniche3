const express = require('express');
const { loginUser, loginAdmin, loginCompany, registerUser } = require('../controllers/AuthController');
const router = express.Router();

// User registration
router.post('/register', registerUser);

// User login
router.post('/login', loginUser);

// Admin login
router.post('/admin/login', loginAdmin);

// Company login
router.post('/company/login', loginCompany);

module.exports = router;