import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

const AppShell = () => {
  const { theme, setTheme, user, setUser, showToast } = useApp();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const logout = () => {
    localStorage.removeItem("sl_token");
    setUser(null);
    showToast("info", "Logged out");
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-text">ServeLocal</div>
          <div className="logo-sub">India • Local services platform</div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Discover</div>
          <Link className={`nav-item ${isActive("/") ? "active" : ""}`} to="/">
            <span className="nav-icon">🏠</span> Home
          </Link>
          <Link
            className={`nav-item ${isActive("/categories") ? "active" : ""}`}
            to="/categories"
          >
            <span className="nav-icon">📂</span> Categories
          </Link>
          <Link
            className={`nav-item ${isActive("/services") ? "active" : ""}`}
            to="/services"
          >
            <span className="nav-icon">🧰</span> Services
          </Link>

          <div className="nav-section-label">My</div>
          <Link
            className={`nav-item ${isActive("/bookings") ? "active" : ""}`}
            to="/bookings"
          >
            <span className="nav-icon">📅</span> Bookings
          </Link>
          <Link
            className={`nav-item ${isActive("/favorites") ? "active" : ""}`}
            to="/favorites"
          >
            <span className="nav-icon">❤️</span> Favourites
          </Link>
          <Link
            className={`nav-item ${isActive("/wallet") ? "active" : ""}`}
            to="/wallet"
          >
            <span className="nav-icon">💰</span> Wallet
          </Link>
          <Link
            className={`nav-item ${isActive("/notifications") ? "active" : ""}`}
            to="/notifications"
          >
            <span className="nav-icon">🔔</span> Notifications
          </Link>
          <Link
            className={`nav-item ${isActive("/chat") ? "active" : ""}`}
            to="/chat"
          >
            <span className="nav-icon">💬</span> Chat
          </Link>

          {user?.role === "provider" && (
            <>
              <div className="nav-section-label">Provider</div>
              <Link
                className={`nav-item ${isActive("/provider/dashboard") ? "active" : ""}`}
                to="/provider/dashboard"
              >
                <span className="nav-icon">📊</span> Dashboard
              </Link>
              <Link
                className={`nav-item ${isActive("/provider/services") ? "active" : ""}`}
                to="/provider/services"
              >
                <span className="nav-icon">🧾</span> My services
              </Link>
              <Link
                className={`nav-item ${
                  isActive("/provider/booking-requests") ? "active" : ""
                }`}
                to="/provider/booking-requests"
              >
                <span className="nav-icon">📥</span> Booking requests
              </Link>
              <Link
                className={`nav-item ${isActive("/provider/earnings") ? "active" : ""}`}
                to="/provider/earnings"
              >
                <span className="nav-icon">💵</span> Earnings
              </Link>
            </>
          )}

          {user?.role === "admin" && (
            <>
              <div className="nav-section-label">Admin</div>
              <Link
                className={`nav-item ${isActive("/admin/dashboard") ? "active" : ""}`}
                to="/admin/dashboard"
              >
                <span className="nav-icon">📈</span> Dashboard
              </Link>
              <Link
                className={`nav-item ${isActive("/admin/users") ? "active" : ""}`}
                to="/admin/users"
              >
                <span className="nav-icon">👥</span> Users
              </Link>
              <Link
                className={`nav-item ${isActive("/admin/providers") ? "active" : ""}`}
                to="/admin/providers"
              >
                <span className="nav-icon">🧑‍🔧</span> Providers
              </Link>
              <Link
                className={`nav-item ${isActive("/admin/analytics") ? "active" : ""}`}
                to="/admin/analytics"
              >
                <span className="nav-icon">📊</span> Analytics
              </Link>
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="avatar">{(user?.name || "G")[0].toUpperCase()}</div>
            <div className="flex-col">
              <div className="font-semibold">{user?.name || "Guest"}</div>
              <div className="text-xs text-muted">{user?.email || "Not logged in"}</div>
            </div>
          </div>

          <div className="mt-3 flex gap-3">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              type="button"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? "🌙" : "☀️"} Theme
            </button>

            {user ? (
              <button className="btn btn-outline btn-sm" onClick={logout} type="button">
                Logout
              </button>
            ) : (
              <Link className="btn btn-primary btn-sm" to="/login">
                Login
              </Link>
            )}
          </div>
        </div>
      </aside>

      <main className="main-content">
        <div className="topbar">
          <div className="text-lg font-bold">ServeLocal</div>
          <div className="text-sm text-muted">Trusted local professionals</div>
        </div>

        <Outlet />
      </main>
    </div>
  );
};

export default AppShell;

