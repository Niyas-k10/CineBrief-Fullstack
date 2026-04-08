import logo from "../assets/images/logo.png";

function AuthLayout({ children }) {
  return (
    <div style={wrapper}>
      <div style={overlay}></div>

      {/* LOGO TOP LEFT */}
      <img src={logo} alt="logo" style={logoStyle} />

      {/* CONTENT */}
      <div style={content}>{children}</div>
    </div>
  );
}

export default AuthLayout;

/* STYLES */

const wrapper = {
  height: "100vh",
  width: "100%",
  position: "relative",
  backgroundImage:
  "url('https://images.unsplash.com/photo-1524985069026-dd778a71c7b4')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat"
};

const overlay = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.65)"
};

const content = {
  position: "relative",
  zIndex: 2,
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column"
};

const logoStyle = {
  position: "absolute",
  top: "20px",
  left: "30px",
  width: "200px",
  zIndex: 3
};