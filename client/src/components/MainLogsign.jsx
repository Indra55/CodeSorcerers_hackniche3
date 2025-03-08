import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const Main = () => {
    const { logout, user } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="bg-gray-100 flex flex-col min-h-screen">
            <motion.nav
                className="bg-white shadow-md p-4 flex justify-between items-center"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-xl font-bold text-blue-500">Your App Name</h1>
                <div className="flex items-center gap-4">
                    <span className="text-gray-600">Welcome, {user?.email || 'User'}</span>
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </motion.nav>
            <motion.div
                className="flex-grow flex justify-center items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-3xl text-gray-800">Welcome to Your Dashboard!</h2>
            </motion.div>
        </div>
    );
};

export default Main;
