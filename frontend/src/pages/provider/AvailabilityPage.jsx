import React from "react";

const AvailabilityPage = () => {
  return (
    <div className="page-body">
      <div className="page-header">
        <h1>Availability</h1>
        <p>Set the days and time slots when you can take bookings.</p>
      </div>
      <div className="card">
        <div className="empty-state">
          <div className="empty-icon">📆</div>
          <h3>Calendar coming soon</h3>
          <p>
            You already have calendar styles in your original HTML. You can reuse them here and
            save availability details in MongoDB.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityPage;

