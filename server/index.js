require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const connection = require('./db.js');
const userRoutes = require('./Routes/users.js');  // ✅ Added .js extension
const authRoutes = require('./Routes/auth.js');    // ✅ Added .js extension

connection();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/users", userRoutes);  // ✅ Correct path
app.use("/api/auth", authRoutes);   // ✅ Correct path

const port = process.env.PORT || 5000;
app.listen(port, () => console.log('Server is running on port', port));
