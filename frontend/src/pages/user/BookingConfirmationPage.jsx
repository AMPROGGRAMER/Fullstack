import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const BookingConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const provider = location.state?.provider || null;

  return (
    <div className="page-body">
      <div className="page-header">
        <h1>Booking confirmed</h1>
        <p>Your request has been placed successfully.</p>
      </div>

      <div className="card">
        <div className="empty-state">
          <div className="empty-icon">✅</div>
          <h3>You're all set!</h3>
          <p>
            We have recorded your booking
            {provider ? ` with ${provider.name}` : ""}. Track it from the bookings page.
          </p>
          <button
            className="btn btn-primary mt-4"
            type="button"
            onClick={() => navigate("/bookings")}
          >
            Go to my bookings
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;

