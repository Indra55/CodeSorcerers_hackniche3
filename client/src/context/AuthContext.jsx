import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem("token");
    if (token) {
      setUser(token);
    }
    setLoading(false);
  }, []);

  const login = async (token, userData) => {
    localStorage.setItem("token", token);
    setUser({ token, ...userData });
    navigate("/home"); // Redirect to home page after login
  };

  const signup = async (token, userData) => {
    localStorage.setItem("token", token);
    setUser({ token, ...userData });
    navigate("/home"); // Redirect to home page after signup
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login"); // Redirect to login page after logout
  };

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a proper loading component
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
