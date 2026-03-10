import React, { useEffect, useState } from "react";
import { fetchAdminSummary } from "../../services/adminService.js";
import { useApp } from "../../context/AppContext.jsx";

const AdminDashboard = () => {
  const { user } = useApp();
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchAdminSummary();
        setSummary(data);
      } catch {
        setSummary(null);
      }
    };
    if (user?.role === "admin") load();
  }, [user]);

  if (!user || user.role !== "admin") {
    return (
      <div className="page-body">
        <div className="empty-state">
          <div className="empty-icon">🔐</div>
          <h3>Admin only</h3>
          <p>Login as an admin user to access this dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-body">
      <div className="page-header">
        <h1>Admin dashboard</h1>
        <p>High level overview of platform activity.</p>
      </div>

      {summary ? (
        <>
          <div className="grid-3">
            <div className="metric-card">
              <div className="metric-icon">👥</div>
              <div className="metric-value">{summary.counts.users}</div>
              <div className="metric-label">Users</div>
            </div>
            <div className="metric-card">
              <div className="metric-icon">🧑‍🔧</div>
              <div className="metric-value">{summary.counts.providers}</div>
              <div className="metric-label">Providers</div>
            </div>
            <div className="metric-card">
              <div className="metric-icon">📅</div>
              <div className="metric-value">{summary.counts.bookings}</div>
              <div className="metric-label">Bookings</div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-muted">Loading admin summary...</div>
      )}
    </div>
  );
};

export default AdminDashboard;

