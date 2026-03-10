import React from "react";

const ProviderReviewsPage = () => {
  return (
    <div className="page-body">
      <div className="page-header">
        <h1>Reviews</h1>
        <p>See what customers are saying about you.</p>
      </div>
      <div className="empty-state">
        <div className="empty-icon">⭐</div>
        <h3>No reviews yet</h3>
        <p>
          You can query the `Review` collection for your provider ID and show ratings and
          comments here.
        </p>
      </div>
    </div>
  );
};

export default ProviderReviewsPage;

