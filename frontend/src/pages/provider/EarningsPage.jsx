import React from "react";

const EarningsPage = () => {
  return (
    <div className="page-body">
      <div className="page-header">
        <h1>Earnings</h1>
        <p>Track how much you have earned from completed jobs.</p>
      </div>
      <div className="card">
        <div className="empty-state">
          <div className="empty-icon">💵</div>
          <h3>No earnings yet</h3>
          <p>
            To power this page you can aggregate completed `Booking` documents by provider and
            show totals here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EarningsPage;

