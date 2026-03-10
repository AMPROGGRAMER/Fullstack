import React from "react";

const PortfolioPage = () => {
  return (
    <div className="page-body">
      <div className="page-header">
        <h1>Portfolio</h1>
        <p>Showcase your past work with photos and descriptions.</p>
      </div>
      <div className="card">
        <div className="empty-state">
          <div className="empty-icon">📸</div>
          <h3>No portfolio items</h3>
          <p>
            Create a `portfolioItems` array on your provider document to store images and
            descriptions, then render them here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;

