import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import AuthLayout from "../components/AuthLayout";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !email || !password) {
      setError("All fields are required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      await API.post("/accounts/register/", {
        username,
        email,
        password
      });

      navigate("/login");
    } catch (err) {
      const data = err.response?.data;

      if (data?.email) setError(data.email[0]);
      else if (data?.username) setError(data.username[0]);
      else setError("Registration failed");
    }
  };

  return (
    <AuthLayout>
      <h1 style={title}>Sign Up</h1>

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
        placeholder="Email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
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

      <button style={btn} onClick={handleRegister}>
        Sign Up
      </button>

      {/* ✅ WHITE LINK */}
      <p style={text}>
        Already have an account?{" "}
        <Link to="/login" style={linkWhite}>
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Register;

/* STYLES */

const title = {
  color: "#fff",
  fontSize: "40px",
  marginBottom: "20px"
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

const text = {
  marginTop: "15px",
  textAlign: "center",
  color: "#ccc"
};

const linkWhite = {
  color: "#fff",
  textDecoration: "none",
  fontWeight: ""
};

const errorStyle = {
  color: "red"
};