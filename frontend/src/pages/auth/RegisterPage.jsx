import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../services/authService.js";
import { useApp } from "../../context/AppContext.jsx";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { setUser, showToast } = useApp();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await register({ name, email, password, role });
      setUser(data.user);
      showToast("success", "Account created");
      navigate("/");
    } catch (err) {
      
      showToast("error", err?.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-logo">
          <div className="logo-big">ServeLocal</div>
          <div className="text-muted mt-1">Create your account</div>
        </div>

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Role</label>
            <select className="form-input form-select" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">User</option>
              <option value="provider">Provider</option>
            </select>
          </div>

          <button className="btn btn-primary btn-lg w-full" disabled={loading} type="submit">
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        <div className="divider">
          <span>Already have an account?</span>
        </div>
        <Link className="btn btn-secondary w-full" to="/login">
          Login
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;

