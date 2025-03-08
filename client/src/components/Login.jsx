import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Login = () => {
    const [data, setData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data: res } = await axios.post("http://localhost:5000/api/auth", data);
            localStorage.setItem("token", res.data);
            navigate("/");
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
            className="flex min-h-screen"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                className="flex-1 bg-gradient-to-l from-blue-500 to-indigo-500 text-white flex flex-col justify-center items-center"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
                <p className="mb-8 text-center max-w-md">
                    To stay connected, please login with your personal info.
                </p>
                <Link to="/signup">
                    <button className="bg-white text-indigo-500 px-6 py-2 rounded-full hover:bg-gray-200 transition">
                        Sign Up
                    </button>
                </Link>
            </motion.div>

            <motion.div
                className="flex-1 flex justify-center items-center bg-white"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="shadow-lg rounded-lg p-8 max-w-md w-full">
                    <h1 className="text-2xl font-bold mb-6 text-center">Login to Your Account</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {["email", "password"].map((field, index) => (
                            <input
                                key={field}
                                type={field === "password" ? "password" : "text"}
                                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                name={field}
                                onChange={handleChange}
                                value={data[field]}
                                required
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        ))}
                        {error && (
                            <p className="text-red-500 text-sm">
                                {error}
                            </p>
                        )}
                        <button
                            type="submit"
                            className="w-full p-2 bg-black text-white rounded hover:bg-gray-800 transition"
                        >
                            Login
                        </button>
                    </form>
                    <div className="text-center mt-4">
                        <span className="text-gray-600">New here? </span>
                        <Link to="/signup" className="text-blue-500">
                            Create an account
                        </Link>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Login;
