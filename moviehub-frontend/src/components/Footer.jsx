import { FaInstagram, FaGlobe, FaFacebook, FaTwitter } from "react-icons/fa";

function Footer() {
  return (
    <footer id="footer" style={footer}> {/* ✅ ID ADDED */}
      <div style={glass}>

        {/* LOGO */}
        <h2 style={logo}>MovieHub</h2>

        {/* DESCRIPTION */}
        <p style={text}>
          Discover movies, share reviews, and explore recommendations.
        </p>

        {/* CONTACT */}
        <div style={contact}>
          <p>Email: moviehub@gmail.com</p>
          <p>Phone: +91 9876543210</p>
          <p>Location: Kerala, India</p>
        </div>

        {/* SOCIAL ICONS */}
        <div style={icons}>
          <a href="#" style={icon}><FaGlobe /></a>
          <a href="#" style={icon}><FaInstagram /></a>
          <a href="#" style={icon}><FaFacebook /></a>   {/* ✅ FACEBOOK */}
          <a href="#" style={icon}><FaTwitter /></a>    {/* ✅ TWITTER (X) */}
        </div>

        {/* COPYRIGHT */}
        <p style={copyright}>
          © {new Date().getFullYear()} MovieHub. All rights reserved.
        </p>

      </div>
    </footer>
  );
}

/* 🔥 STYLES */

const footer = {
  marginTop: "50px",
  padding: "60px 20px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(-45deg, #050606, #020303, #0a0a0b, #000000)",
  backgroundSize: "400% 400%",
  animation: "gradientMove 10s ease infinite"
};

const glass = {
  width: "100%",
  maxWidth: "900px",
  padding: "30px",
  background: "rgba(255,255,255,0.05)",
  borderRadius: "15px",
  backdropFilter: "blur(15px)",
  border: "1px solid rgba(255,255,255,0.1)",
  textAlign: "center",
  color: "#fff"
};

const logo = {
  marginBottom: "10px"
};

const text = {
  fontSize: "14px",
  marginBottom: "20px",
  color: "#ccc"
};

const contact = {
  lineHeight: "1.8",
  marginBottom: "20px",
  fontSize: "14px",
  color: "#bbb"
};

const icons = {
  display: "flex",
  justifyContent: "center",
  gap: "25px",
  marginBottom: "20px"
};

const icon = {
  fontSize: "22px",
  color: "#fff",
  transition: "0.3s"
};

const copyright = {
  fontSize: "12px",
  color: "#aaa"
};

export default Footer;