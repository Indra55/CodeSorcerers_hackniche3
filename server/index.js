require("dotenv").config();
const express = require('express');
const cors = require('cors');
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/Auth");
const productRoutes = require("./routes/Product");
const orderRoutes = require("./routes/Order");
const cartRoutes = require("./routes/Cart");
const brandRoutes = require("./routes/Brand");
const categoryRoutes = require("./routes/Category");
const userRoutes = require("./routes/User");
const addressRoutes = require('./routes/Address');
const reviewRoutes = require("./routes/Review");
const wishlistRoutes = require("./routes/Wishlist");
const { connectToDB } = require("./database/db");
const verifyToken = require('./middleware/auth');

// Initialize server
const server = express();

// Connect to Database
connectToDB();

// CORS Configuration
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5174"
];

server.use(cors({
    origin: allowedOrigins,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"],
}));

// Middlewares
server.use(express.json());
server.use(cookieParser());
server.use(morgan("tiny"));

// Routes
server.use("/auth", authRoutes);
server.use("/users", verifyToken, userRoutes);
server.use("/products", productRoutes);  // Public Access
server.use("/orders", verifyToken, orderRoutes);
server.use("/cart", verifyToken, cartRoutes);
server.use("/brands", verifyToken, brandRoutes);
server.use("/categories", verifyToken, categoryRoutes);
server.use("/address", verifyToken, addressRoutes);
server.use("/reviews", verifyToken, reviewRoutes);
server.use("/wishlist", verifyToken, wishlistRoutes);

// Default route
server.get("/", (req, res) => {
    res.status(200).json({ message: 'Server is running!' });
});

// Start Server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
