import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
    const [data, setData] = useState({ email: "", password: "" });
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
        try {
            const res = await axios.post("http://localhost:8000/auth/login", data);
            if (res.data.token) {
                localStorage.setItem("token", res.data.token);
                setSuccess("✅ Login successful! Redirecting...");
                
                // Hide success message after 3 seconds and navigate
                setTimeout(() => {
                    setSuccess("");
                    navigate("/");
                }, 3000);
            } else {
                setError("Login failed, please try again.");
            }
        } catch (error) {
            setError(error.response?.data?.message || "Server not responding. Try again later.");
        }
    };

    return (
        <motion.div
            className="flex min-h-screen p-5 justify-center items-center bg-white"
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

            {/* Main Container */}
            <motion.div
                className="flex flex-col lg:flex-row bg-white shadow-lg rounded-3xl overflow-hidden max-w-4xl w-full"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Left Section (Welcome) */}
                <div className="lg:w-1/2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white flex flex-col justify-center items-center p-8 min-h-full">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">Welcome Back!</h2>
                    <p className="mb-6 text-center max-w-xs md:max-w-sm">
                        To stay connected, please login with your personal info.
                    </p>
                </div>

                {/* Right Section (Login Form) */}
                <div className="lg:w-1/2 flex justify-center items-center p-8">
                    <div className="w-full max-w-sm">
                        <h1 className="text-xl md:text-2xl font-bold mb-6 text-center">Login to Your Account</h1>
                        <form onSubmit={handleSubmit} className="space-y-4">
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
                                Login
                            </button>
                        </form>

                        {/* Sign-up Section */}
                        <div className="text-center mt-6 bg-white py-4">
                            <p className="text-gray-600 mb-2">If you have not registered yet, sign up below.</p>
                            <Link to="/signup">
                                <button className="bg-white border border-gray-300 text-indigo-500 px-6 py-2 rounded-full hover:bg-gray-100 transition">
                                    Sign Up
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Login;
