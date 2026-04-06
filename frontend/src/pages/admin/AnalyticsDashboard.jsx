import React, { useEffect, useState } from "react";
import { fetchAdminSummary } from "../../services/adminService.js";
import { useApp } from "../../context/AppContext.jsx";

const AnalyticsDashboard = () => {
  const { user, showToast } = useApp();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const summary = await fetchAdminSummary();
        setData(summary);
      } catch (e) {
        showToast("error", "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    if (user?.role === "admin") load();
    else setLoading(false);
  }, [user, showToast]);

  if (!user || user.role !== "admin") {
    return (
      <div className="page-body">
        <div className="empty-state">
          <div className="empty-icon">🔐</div>
          <h3>Admin only</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="page-body">
      <div className="page-header">
        <h1>Analytics</h1>
        <p>Visualise platform performance with charts and metrics.</p>
      </div>

      {loading ? (
        <div className="text-muted">Loading...</div>
      ) : !data ? (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3>No data available</h3>
        </div>
      ) : (
        <>
          <div className="grid-4 mb-6">
            <div className="metric-card">
              <div className="metric-icon">👥</div>
              <div className="metric-value">{data.counts?.users || 0}</div>
              <div className="metric-label">Total Users</div>
            </div>
            <div className="metric-card">
              <div className="metric-icon">🧑‍🔧</div>
              <div className="metric-value">{data.counts?.providers || 0}</div>
              <div className="metric-label">Providers</div>
            </div>
            <div className="metric-card">
              <div className="metric-icon">📅</div>
              <div className="metric-value">{data.counts?.bookings || 0}</div>
              <div className="metric-label">Bookings</div>
            </div>
            <div className="metric-card">
              <div className="metric-icon">🧾</div>
              <div className="metric-value">{data.counts?.services || 0}</div>
              <div className="metric-label">Services</div>
            </div>
          </div>

          <div className="grid-2">
            <div className="card">
              <h3 className="card-title">Platform Health</h3>
              <div className="mt-3">
                <div className="flex justify-between mb-2">
                  <span>Pending Bookings</span>
                  <span className="font-semibold">{data.counts?.pendingBookings || 0}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Completed Bookings</span>
                  <span className="font-semibold">{data.counts?.completedBookings || 0}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Approved Providers</span>
                  <span className="font-semibold">{data.counts?.approvedProviders || 0}</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="card-title">Revenue</h3>
              <div className="mt-3">
                <div className="price rupee text-2xl">₹{data.revenue?.total || 0}</div>
                <p className="text-muted mt-2">Total platform revenue from paid bookings</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsDashboard;

