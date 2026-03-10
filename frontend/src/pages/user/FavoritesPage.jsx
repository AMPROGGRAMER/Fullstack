import React from "react";

// For now, favourites are local-only. You can later persist
// them in MongoDB on the user document.
const FavoritesPage = () => {
  return (
    <div className="page-body">
      <div className="page-header">
        <h1>Favourites</h1>
        <p>Save providers you love and rebook in one tap.</p>
      </div>
      <div className="empty-state">
        <div className="empty-icon">❤️</div>
        <h3>No favourites yet</h3>
        <p>
          You can add a favourites feature by saving provider IDs on the user record and showing
          them here.
        </p>
      </div>
    </div>
  );
};

export default FavoritesPage;

