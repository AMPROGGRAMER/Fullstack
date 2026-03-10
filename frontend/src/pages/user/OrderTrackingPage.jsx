import React from "react";

const OrderTrackingPage = () => {
  return (
    <div className="page-body">
      <div className="page-header">
        <h1>Order tracking</h1>
        <p>Track the status of your ongoing bookings.</p>
      </div>
      <div className="empty-state">
        <div className="empty-icon">📍</div>
        <h3>Basic tracking</h3>
        <p>
          Each booking already has a status (pending / confirmed / completed / cancelled) in the
          bookings table. You can extend this page with map tracking later.
        </p>
      </div>
    </div>
  );
};

export default OrderTrackingPage;

