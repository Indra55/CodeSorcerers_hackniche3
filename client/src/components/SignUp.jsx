import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const SignUp = () => {
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        navigate("/home")
        try {
            const url = "http://localhost:5000/api/users";
            const { data: res } = await axios.post(url, data);
            setSuccess("Account created successfully! Redirecting...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (error) {
            if (
                error.response &&
                error.response.status >= 400 &&
                error.response.status <= 500
            ) {
                setError(error.response.data.message);
            }
        }
    };

    return (
        <motion.div 
            className="flex min-h-screen "
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Left Side - Sign Up Form */}
            <motion.div 
                className="flex-1 flex justify-center items-center bg-white"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div 
                    className="shadow-lg rounded-lg p-8 max-w-md w-full"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <motion.h1 
                        className="text-2xl font-bold mb-6 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.7 }}
                    >
                        Create Account
                    </motion.h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {["firstName", "lastName", "email", "password"].map((field, index) => (
                            <motion.input 
                                key={field}
                                type={field === "password" ? "password" : "text"}
                                placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                                name={field}
                                onChange={handleChange}
                                value={data[field]}
                                required
                                className="w-full p-2 border border-gray-300 rounded"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.2 * index }}
                            />
                        ))}
                        {error && <motion.div 
                            className="text-red-500 text-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >{error}</motion.div>}
                        {success && <motion.div 
                            className="text-green-500 text-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >{success}</motion.div>}
                        <motion.button 
                            type="submit"
                            className="w-full p-2 bg-black text-white rounded hover:bg-gray-800 transform transition-transform duration-200 hover:scale-105"
                            whileTap={{ scale: 0.95 }}
                        >
                            Sign Up
                        </motion.button>
                    </form>
                    <motion.div 
                        className="text-center mt-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <span className="text-gray-600">Already have an account? </span>
                        <Link to="/login" className="text-blue-500">Sign In</Link>
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Right Side - Welcome Section */}
            <motion.div 
                className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 text-white flex flex-col justify-center items-center"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <motion.h2 
                    className="text-3xl font-bold mb-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    Welcome Back!
                </motion.h2>
                <motion.p 
                    className="mb-8 text-center max-w-md"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    To keep connected with us please login with your personal info.
                </motion.p>
                <Link to="/login">
                    <motion.button 
                        className="bg-white text-red-500 px-6 py-2 rounded-full hover:bg-gray-200 transition transform hover:scale-105"
                        whileTap={{ scale: 0.95 }}
                    >
                        Sign In
                    </motion.button>
                </Link>
            </motion.div>
        </motion.div>
    );
};

export default SignUp;
