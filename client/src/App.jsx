import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/SignUp";
import Main from "./components/MainLogsign";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/home" element={<Home />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Main />
        </ProtectedRoute>
      } />

      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
  );
};

export default App;
