import { motion } from "framer-motion";

const Main = () => {
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };

    return (
        <div className="bg-gray-100 flex flex-col">
            <motion.nav
                className="bg-white shadow-md p-4 flex justify-between items-center"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-xl font-bold text-blue-500">fakebook</h1>
                <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </motion.nav>
            <motion.div
                className="flex-grow flex justify-center items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-3xl text-gray-800">Welcome to fakebook!</h2>
            </motion.div>
        </div>
    );
};

export default Main;
