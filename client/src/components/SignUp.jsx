import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const SignUp = () => {
    const [data, setData] = useState({
        name: "",    
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const { signup } = useAuth();

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        try {
            const url = "http://localhost:8000/auth/register";
            const response = await axios.post(url, data);
            
            if (response.data.token) {
                setSuccess("✅ Account created successfully! Redirecting...");
                // Use auth context to login after successful signup
                await signup(response.data.token, response.data.user);
            } else {
                setError("Registration failed. Please try again.");
            }
        } catch (error) {
            if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                setError(error.response.data.message);
            } else {
                setError("Network error. Please try again.");
            }
        }
    };

    return (
        <motion.div
            className="flex flex-col min-h-screen p-5 justify-center items-center bg-white"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Success Banner */}
            <AnimatePresence>
                {success && (
                    <motion.div
                        className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-3 px-6 rounded-lg shadow-lg"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                    >
                        {success}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                className="flex flex-col-reverse lg:flex-row bg-white shadow-lg rounded-3xl overflow-hidden max-w-4xl w-full"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Signup Form */}
                <div className="lg:w-1/2 flex justify-center items-center p-8">
                    <div className="w-full max-w-sm">
                        <h1 className="text-xl md:text-2xl font-bold mb-6 text-center">Create Your Account</h1>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Full Name"
                                name="name"
                                onChange={handleChange}
                                value={data.name}
                                required
                                className="w-full p-3 border border-gray-300 rounded text-sm md:text-base"
                            />
                            {["email", "password"].map((field) => (
                                <input
                                    key={field}
                                    type={field === "password" ? "password" : "text"}
                                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                    name={field}
                                    onChange={handleChange}
                                    value={data[field]}
                                    required
                                    className="w-full p-3 border border-gray-300 rounded text-sm md:text-base"
                                />
                            ))}
                            {error && (
                                <p className="text-red-500 text-sm md:text-base text-center">{error}</p>
                            )}
                            <button
                                type="submit"
                                className="w-full p-3 bg-black text-white rounded hover:bg-gray-800 transition"
                            >
                                Sign Up
                            </button>
                        </form>

                        {/* Login Section */}
                        <div className="text-center mt-6 bg-white py-4">
                            <p className="text-gray-600 mb-2">Already have an account? Log in below.</p>
                            <Link to="/login">
                                <button className="bg-white border border-gray-300 text-indigo-500 px-6 py-2 rounded-full hover:bg-gray-100 transition">
                                    Login
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Welcome Section */}
                <div className="lg:w-1/2 bg-gradient-to-r from-pink-500 to-red-500 text-white flex flex-col justify-center items-center p-8 min-h-full">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">Join Us!</h2>
                    <p className="mb-6 text-center max-w-xs md:max-w-sm">
                        Create an account to start your journey with us.
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default SignUp;
