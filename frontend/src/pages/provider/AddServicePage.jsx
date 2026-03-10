import React from "react";

const AddServicePage = () => {
  return (
    <div className="page-body">
      <div className="page-header">
        <h1>Add service</h1>
        <p>Create a new service offering under your provider profile.</p>
      </div>
      <div className="card">
        <div className="empty-state">
          <div className="empty-icon">🧾</div>
          <h3>Service creation stub</h3>
          <p>
            Backend already has the `Provider` model. You can extend this page to post data to
            `/api/providers` and store more details per service.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddServicePage;

