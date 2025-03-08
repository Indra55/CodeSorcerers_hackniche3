// components/Layout.jsx
import Header from "../components/Layouts/Header";
import { useLocation } from "react-router-dom";
import ChatBot from "./ChatBot";

const Layout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div>
      {!isAuthPage && <Header />}
      <main>{children}</main>
      <ChatBot />
    </div>
  );
};

export default Layout;