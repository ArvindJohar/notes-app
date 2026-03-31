import { useState } from "react";
import axios from "axios";
import "./Login.css";

function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleSubmit = async () => {
    if (!username || !password) {
      setError("Username and password are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const url = isRegister ? "/api/auth/register" : "/api/auth/login";
      const res = await axios.post(
        url,
        { username, password },
        { withCredentials: true }
      );

      if (isRegister) {
        alert("Account created! Please login.");
        setIsRegister(false);
        setUsername("");
        setPassword("");
      } else {
        // Store user info in localStorage
        localStorage.setItem("user", JSON.stringify(res.data));
        setUser(res.data);
      }
    } catch (err) {
      console.log(err);
      setError(
        err.response?.data?.error ||
        (isRegister ? "Registration failed" : "Invalid username or password")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = () => {
    const guestUser = { username: "Guest", role: "guest" };
    localStorage.setItem("user", JSON.stringify(guestUser));
    setUser(guestUser);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">{isRegister ? "Create account" : "Welcome back"}</h2>
        <p className="login-subtitle">{isRegister ? "Sign up to get started" : "Sign in to your workspace"}</p>

        {/* Username */}
        <div className="input-group">
          <input
            className="login-input"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => { setUsername(e.target.value); setError(""); }}
          />
        </div>

        {/* Password */}
        <div className="input-group password-wrapper">
          <input
            className="login-input"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        {/* Error message */}
        {error && <p className="login-error">{error}</p>}

        {/* Login / Register button */}
        <button
          className="login-button"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Please wait..." : isRegister ? "Register" : "Login"}
        </button>

        {/* Guest login */}
        {!isRegister && (
          <button className="guest-button" onClick={handleGuest}>
            Continue as Guest
          </button>
        )}

        {/* Toggle Login/Register */}
        <p
          className="login-toggle"
          onClick={() => { setIsRegister(!isRegister); setError(""); setUsername(""); setPassword(""); }}
        >
          {isRegister ? (
            <>Already have an account? <span>Login</span></>
          ) : (
            <>New here? <span>Create an account</span></>
          )}
        </p>
      </div>
    </div>
  );
}

export default Login;