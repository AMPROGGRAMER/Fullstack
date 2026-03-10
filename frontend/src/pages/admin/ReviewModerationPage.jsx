import React from "react";

const ReviewModerationPage = () => {
  return (
    <div className="page-body">
      <div className="page-header">
        <h1>Review moderation</h1>
        <p>Keep your platform healthy by moderating abusive reviews.</p>
      </div>
      <div className="empty-state">
        <div className="empty-icon">🛡️</div>
        <h3>Moderation tools placeholder</h3>
        <p>
          You can load all reviews from MongoDB here and add actions such as “hide”, “flag”, or
          “ban user”.
        </p>
      </div>
    </div>
  );
};

export default ReviewModerationPage;

