import React from "react";

const DisputeResolutionPage = () => {
  return (
    <div className="page-body">
      <div className="page-header">
        <h1>Dispute resolution</h1>
        <p>Handle issues raised between customers and providers.</p>
      </div>
      <div className="card">
        <div className="empty-state">
          <div className="empty-icon">⚖️</div>
          <h3>Dispute handling placeholder</h3>
          <p>
            Implement a `disputes` collection with status (open / resolved) and show them here
            to track complaints.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DisputeResolutionPage;

