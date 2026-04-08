import { useState } from "react";
import API from "../services/api";
import AuthLayout from "../components/AuthLayout";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email) {
      setError("Email is required");
      return;
    }

    try {
      await API.post("/accounts/password-reset/", { email });
      setMsg("Reset link sent to your email");
      setError("");
    } catch {
      setError("Error sending email");
      setMsg("");
    }
  };

  return (
    <AuthLayout>
      <h1 style={title}>Forgot Password</h1>

      {msg && <p style={success}>{msg}</p>}
      {error && <p style={errorStyle}>{error}</p>}

      <input
        style={input}
        placeholder="Enter your email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setError("");
        }}
      />

      <button style={btn} onClick={handleSubmit}>
        Send Reset Link
      </button>
    </AuthLayout>
  );
}

export default ForgotPassword;

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
  cursor: "pointer",
  borderRadius: "5px"
};

const success = {
  color: "lightgreen"
};

const errorStyle = {
  color: "red"
};