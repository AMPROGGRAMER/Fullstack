import React from "react";

const ManageServicesPage = () => {
  return (
    <div className="page-body">
      <div className="page-header">
        <h1>Manage services</h1>
        <p>High level control over all service types on the platform.</p>
      </div>
      <div className="empty-state">
        <div className="empty-icon">🧰</div>
        <h3>Service management placeholder</h3>
        <p>
          Tie this page to categories / provider offerings once you decide on the exact data
          model.
        </p>
      </div>
    </div>
  );
};

export default ManageServicesPage;

