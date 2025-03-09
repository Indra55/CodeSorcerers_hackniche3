import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Onboarding = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (selectedRole === "customer") {
      navigate("/login");
    } else if (selectedRole === "seller") {
      window.location.href = "https://kzmqp7i04bnrjwiyaw4z.lite.vusercontent.net/";
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-96 p-8 bg-white rounded-2xl shadow-2xl text-center"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome to ShopEase</h2>
        <p className="text-gray-600 mb-4">Select your role to continue</p>
        <div className="flex flex-col space-y-4">
          {["customer", "seller"].map((role) => (
            <motion.div key={role} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button
                onClick={() => setSelectedRole(role)}
                className={`w-full py-3 rounded-lg font-medium text-white transition duration-300 ${
                  selectedRole === role ? "bg-blue-600 shadow-md" : "bg-gray-400 hover:bg-gray-500"
                }`}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)} Login
              </button>
            </motion.div>
          ))}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button
              onClick={handleLogin}
              disabled={!selectedRole}
              className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Proceed to Login
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;
