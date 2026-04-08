import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import AuthLayout from "../components/AuthLayout";

function ResetPassword() {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleReset = async () => {
    if (!password) {
      setError("Password is required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      await API.post("/accounts/password-reset-confirm/", {
        uid,
        token,
        new_password: password
      });

      setMsg("Password reset successful");
      setError("");

      // redirect after 2 sec
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch {
      setError("Invalid or expired link");
      setMsg("");
    }
  };

  return (
    <AuthLayout>
      <h1 style={title}>Reset Password</h1>

      {/* ✅ SAME STYLE AS FORGOT */}
      {msg && <p style={success}>{msg}</p>}
      {error && <p style={errorStyle}>{error}</p>}

      <input
        style={input}
        type="password"
        placeholder="Enter new password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setError("");
        }}
      />

      <button style={btn} onClick={handleReset}>
        Reset Password
      </button>
    </AuthLayout>
  );
}

export default ResetPassword;

/* SAME STYLES */

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
  color: "lightgreen",
  marginBottom: "10px"
};

const errorStyle = {
  color: "red",
  marginBottom: "10px"
};