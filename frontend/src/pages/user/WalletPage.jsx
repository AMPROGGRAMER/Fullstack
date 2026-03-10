import React from "react";

const WalletPage = () => {
  return (
    <div className="page-body">
      <div className="page-header">
        <h1>Wallet</h1>
        <p>Track your credits, refunds, and transactions.</p>
      </div>
      <div className="card">
        <div className="empty-state">
          <div className="empty-icon">💰</div>
          <h3>No wallet transactions yet</h3>
          <p>
            You can extend this page with a `walletTransactions` collection in MongoDB and show
            credit/debit history.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;

