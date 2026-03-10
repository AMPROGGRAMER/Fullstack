import React from "react";

// This is a simple shell – actual review CRUD can reuse /api/reviews.
const ReviewsPage = () => {
  return (
    <div className="page-body">
      <div className="page-header">
        <h1>My reviews</h1>
        <p>See reviews you have left for providers.</p>
      </div>
      <div className="empty-state">
        <div className="empty-icon">⭐</div>
        <h3>Reviews listing placeholder</h3>
        <p>
          The backend supports reviews; you can extend this page to call `/api/reviews` and show
          them here.
        </p>
      </div>
    </div>
  );
};

export default ReviewsPage;

