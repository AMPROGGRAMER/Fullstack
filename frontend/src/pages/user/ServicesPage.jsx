import React from "react";

// Simple placeholder – in a real app you might group providers/services by category.
const ServicesPage = () => {
  return (
    <div className="page-body">
      <div className="page-header">
        <h1>Services</h1>
        <p>Explore popular home services across India.</p>
      </div>
      <div className="empty-state">
        <div className="empty-icon">🧰</div>
        <h3>Service catalogue coming soon</h3>
        <p>
          Core flows (providers, bookings, categories) are already connected. You can extend
          this page to show custom curated services.
        </p>
      </div>
    </div>
  );
};

export default ServicesPage;

