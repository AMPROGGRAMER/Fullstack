import React from "react";

const ManageServicesPage = () => {
  return (
    <div className="page-body">
      <div className="page-header">
        <h1>My services</h1>
        <p>View and manage the services you offer.</p>
      </div>
      <div className="empty-state">
        <div className="empty-icon">🧰</div>
        <h3>No services listed</h3>
        <p>Use the “Add service” page to define offerings for your provider profile.</p>
      </div>
    </div>
  );
};

export default ManageServicesPage;

