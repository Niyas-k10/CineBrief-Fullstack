import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaSearch,
  FaHeart,
  FaUser,
  FaSignOutAlt
} from "react-icons/fa";

import { FaPhone } from "react-icons/fa6"; // ✅ phone icon

import logo from "../assets/images/logo.png";

function Navbar({ setToken }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  // ✅ SCROLL FUNCTION
  const scrollToFooter = () => {
    setTimeout(() => {
      const footer = document.getElementById("footer");
      if (footer) {
        footer.scrollIntoView({ behavior: "smooth" });
      }
    }, 300);
  };

  // ✅ CONTACT CLICK (WORKS FROM ANY PAGE)
  const handleContactClick = () => {
    if (location.pathname !== "/home") {
      navigate("/home", { state: { scrollToFooter: true } });
    } else {
      scrollToFooter();
    }
  };

  return (
    <nav style={navStyle}>
      {/* LOGO */}
      <div style={logoWrapper}>
        <img
          src={logo}
          alt="CineBrief Logo"
          style={logoStyle}
          onClick={() => navigate("/home")}
        />
      </div>

      {/* ICONS */}
      <div style={navLinks}>
        <Link to="/home" style={getIconStyle(isActive("/home"))}>
          <FaHome />
        </Link>

        <Link to="/search" style={getIconStyle(isActive("/search"))}>
          <FaSearch />
        </Link>

        <Link to="/favorites" style={getIconStyle(isActive("/favorites"))}>
          <FaHeart />
        </Link>

        <Link to="/profile" style={getIconStyle(isActive("/profile"))}>
          <FaUser />
        </Link>

        {/* ✅ CONTACT (PHONE) */}
        {/* <div onClick={handleContactClick} style={getIconStyle(false)}>
          <FaPhone />
        </div> */}

        {/* LOGOUT */}
        <div onClick={handleLogout} style={getIconStyle(false)}>
          <FaSignOutAlt />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

/* 🔥 STYLES */

const navStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 9999,
  height: "70px",
  padding: "0 30px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "rgba(15, 15, 15, 0.9)",
  backdropFilter: "blur(12px)",
  boxShadow: "0 4px 20px rgba(0,0,0,0.5)"
};

const logoWrapper = {
  height: "100%",
  display: "flex",
  alignItems: "center",
  overflow: "hidden"
};

const logoStyle = {
  height: "95px",
  transform: "scale(1.2)",
  objectFit: "contain",
  cursor: "pointer"
};

const navLinks = {
  display: "flex",
  gap: "22px",
  alignItems: "center"
};

const getIconStyle = (active) => ({
  color: active ? "#e50914" : "#fff",
  fontSize: "20px",
  cursor: "pointer",
  transition: "0.3s"
});