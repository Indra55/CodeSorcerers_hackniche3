import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/SignUp";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layouts";
import ProductList from "./components/Products/ProductList";
import ProductDetails from "./components/Products/ProductDetails";

const App = () => {
  return (
   <AuthProvider>
     <Layout>
      <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/home" element={<Home />} />
      <Route path="/" element={<Login />} />
      <Route path="/products" element={<ProductList />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
    </Layout>
   </AuthProvider>
  );
};

export default App;
