import React from "react";

const BookingRequestsPage = () => {
  return (
    <div className="page-body">
      <div className="page-header">
        <h1>Booking requests</h1>
        <p>Requests from customers for your services.</p>
      </div>
      <div className="empty-state">
        <div className="empty-icon">📥</div>
        <h3>No requests yet</h3>
        <p>
          You can later filter the `Booking` collection by your provider ID and show pending /
          confirmed requests here.
        </p>
      </div>
    </div>
  );
};

export default BookingRequestsPage;

