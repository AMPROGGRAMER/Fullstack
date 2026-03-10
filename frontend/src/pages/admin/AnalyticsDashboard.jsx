import React from "react";

const AnalyticsDashboard = () => {
  return (
    <div className="page-body">
      <div className="page-header">
        <h1>Analytics</h1>
        <p>Visualise platform performance with charts and metrics.</p>
      </div>
      <div className="card">
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3>Analytics placeholder</h3>
          <p>
            Plug this into MongoDB aggregations or an external BI tool to show revenue, growth,
            and categorywise demand.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;

