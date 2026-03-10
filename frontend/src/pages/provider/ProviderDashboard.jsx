import React from "react";
import { useApp } from "../../context/AppContext.jsx";

const ProviderDashboard = () => {
  const { user } = useApp();

  if (!user || user.role !== "provider") {
    return (
      <div className="page-body">
        <div className="empty-state">
          <div className="empty-icon">🔐</div>
          <h3>Provider access only</h3>
          <p>Login as a provider account to view this dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-body">
      <div className="page-header">
        <h1>Provider dashboard</h1>
        <p>See a quick overview of your performance.</p>
      </div>
      <div className="grid-3">
        <div className="metric-card">
          <div className="metric-icon">📅</div>
          <div className="metric-value">0</div>
          <div className="metric-label">Upcoming bookings</div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">✅</div>
          <div className="metric-value">0</div>
          <div className="metric-label">Completed jobs</div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">⭐</div>
          <div className="metric-value">0.0</div>
          <div className="metric-label">Average rating</div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;

