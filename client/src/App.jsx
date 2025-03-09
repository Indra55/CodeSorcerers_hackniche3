import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/SignUp";
import Onboarding from "./onboardingpage"; // Added Onboarding
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layouts";
import ProductList from "./components/Products/ProductList";
import ProductDetails from "./components/Products/ProductDetails";
import CartPage from "./components/Cart/Cart";
import CheckoutPage from "./components/Checkout/Checkout";
import OrderConfirmation from "./components/Checkout/OrderConfirmation";
import { useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

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
      <CartProvider>
        <Layout>
          <Routes>
            {/* Onboarding Route - Show this first */}
            <Route path="/onboarding" element={<Onboarding />} />

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
                <ProductList />
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
            <Route path="/cart" element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            } />
            <Route path="/checkout" element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            } />
            <Route path="/order-confirmation/:id" element={
              <ProtectedRoute>
                <OrderConfirmation />
              </ProtectedRoute>
            } />

            {/* Root Route - Redirect to onboarding first if not completed */}
            <Route path="/" element={<Navigate to="/onboarding" replace />} />

            {/* 404 Route */}
            <Route path="*" element={<h1>404 Not Found</h1>} />
          </Routes>
        </Layout>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
