import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import AuthLayout from "../components/AuthLayout";

function Login({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }

    try {
      const res = await API.post("/token/", { username, password });

      const token = res.data.access;
      localStorage.setItem("token", token);
      setToken(token);

      navigate("/home");
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <AuthLayout>
      <h1 style={title}>Sign In</h1>

      {/* ✅ SMALL PARAGRAPH */}
      <p style={subtitle}>
        Discover new movies, track what you love, and share your thoughts with CineBrief. Your personalized movie experience starts here.
      </p>

      {error && <p style={errorStyle}>{error}</p>}

      <input
        style={input}
        placeholder="Username"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
          setError("");
        }}
      />

      <input
        style={input}
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setError("");
        }}
      />

      <button style={btn} onClick={handleLogin}>
        Sign In
      </button>

      
      {/* ✅ UPDATED TEXT */}
      <p style={linkText}>
        Don't have an account?{" "}
        <Link to="/register" style={linkWhite}>
          Sign up
        </Link>
      </p>


      {/* ✅ FORGOT PASSWORD */}
      <p style={linkText}>
        <Link to="/forgot-password" style={linkWhite}>
          Forgot password?
        </Link>
      </p>

    </AuthLayout>
  );
}

export default Login;

/* STYLES */

const title = {
  color: "#fff",
  fontSize: "42px",
  marginBottom: "10px"
};

const subtitle = {
  color: "#ccc",
  fontSize: "14px",
  maxWidth: "320px",
  textAlign: "center",
  marginBottom: "20px",
  lineHeight: "1.5"
};

const input = {
  width: "300px",
  padding: "14px",
  margin: "10px 0",
  borderRadius: "5px",
  border: "none",
  background: "rgba(255,255,255,0.2)",
  color: "#fff",
  backdropFilter: "blur(6px)"
};

const btn = {
  width: "300px",
  padding: "14px",
  background: "#e50914",
  border: "none",
  color: "#fff",
  fontWeight: "bold",
  marginTop: "10px",
  cursor: "pointer",
  borderRadius: "5px"
};

const linkText = {
  marginTop: "12px",
  textAlign: "center",
  color: "#ccc"
};

const linkWhite = {
  color: "#fff",
  textDecoration: "none",
  fontWeight: ""
};

const errorStyle = {
  color: "red",
  marginBottom: "10px"
};