import React from "react";
import { useNavigate } from "react-router-dom";

const ProviderCard = ({ provider }) => {
  const navigate = useNavigate();

  return (
    <div className="provider-card" onClick={() => navigate(`/providers/${provider._id}`)}>
      <div className="provider-card-cover">
        <span>{provider.emoji || "🔧"}</span>
      </div>
      <div className="provider-card-body">
        <div className="provider-card-header">
          <div className="provider-info">
            <div className="provider-name">{provider.name}</div>
            <div className="provider-category">
              {provider.category} • {provider.city || "India"}
            </div>
            <div className="rating-row mt-2">
              <span className="stars">★★★★★</span>
              <span>{Number(provider.rating || 0).toFixed(1)}</span>
              <span className="rating-count">({provider.ratingCount || 0})</span>
            </div>
          </div>
        </div>

        <div className="provider-tags">
          {(provider.tags || []).slice(0, 3).map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>

        <div className="price-row">
          <div className="price rupee">
            ₹{provider.priceFrom ?? 499}
            <span> / {provider.priceUnit || "visit"}</span>
          </div>
          <button className="btn btn-primary btn-sm" type="button">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProviderCard;

