import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

// This page assumes you navigate here with state from some provider card,
// but it still renders even without it.
const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const provider = location.state?.provider || null;

  const handleContinue = (e) => {
    e.preventDefault();
    navigate("/booking/confirmation", { state: { provider } });
  };

  return (
    <div className="page-body">
      <div className="page-header">
        <h1>Booking details</h1>
        <p>Confirm your service requirements before final confirmation.</p>
      </div>

      <div className="card">
        {provider && (
          <div className="mb-4">
            <div className="text-xl font-bold">{provider.name}</div>
            <div className="text-muted mt-1">
              {provider.category} • {provider.city}
            </div>
          </div>
        )}

        <form onSubmit={handleContinue}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Date</label>
              <input className="form-input" type="date" required />
            </div>
            <div className="form-group">
              <label className="form-label">Time</label>
              <input className="form-input" type="time" required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Address</label>
            <input className="form-input" placeholder="Flat / Street / Area / City" required />
          </div>
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea className="form-input" rows={3} placeholder="Describe your issue" />
          </div>
          <button className="btn btn-primary btn-lg" type="submit">
            Continue to confirmation
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingPage;

