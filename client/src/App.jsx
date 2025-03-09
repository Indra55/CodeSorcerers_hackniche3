import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/SignUp";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layouts";
import ProductList from "./components/Products/ProductList";
import ProductDetails from "./components/Products/ProductDetails";
import { useAuth } from "./context/AuthContext";

// Public route wrapper that redirects to home if already logged in
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/home" />;
  }
  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/signup" element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          } />

          {/* Protected Routes */}
          <Route path="/home" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/products" element={
            <ProtectedRoute>
              <ProductList />
            </ProtectedRoute>
          } />
          <Route path="/product/:id" element={
            <ProtectedRoute>
              <ProductDetails />
            </ProtectedRoute>
          } />

          {/* Root Route - Redirect to home if logged in, otherwise to login */}
          <Route path="/" element={
            <PublicRoute>
              <Navigate to="/login" replace />
            </PublicRoute>
          } />

          {/* 404 Route */}
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </Layout>
    </AuthProvider>
  );
};

export default App;