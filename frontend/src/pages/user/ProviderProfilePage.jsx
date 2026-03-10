import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProviderById } from "../../services/providerService.js";
import { createBooking } from "../../services/bookingService.js";
import { useApp } from "../../context/AppContext.jsx";

const ProviderProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, showToast } = useApp();
  const [provider, setProvider] = useState(null);
  const [date, setDate] = useState("");

  useEffect(() => {
    const load = async () => {
      const data = await fetchProviderById(id);
      setProvider(data);
    };
    load();
  }, [id]);

  const onBook = async () => {
    if (!user) {
      showToast("info", "Please login to book");
      navigate("/login");
      return;
    }
    if (!date) {
      showToast("error", "Please select date/time");
      return;
    }

    await createBooking({
      providerId: provider._id,
      serviceName: provider.category,
      date,
      amount: provider.priceFrom ?? 499,
      city: provider.city,
      notes: ""
    });
    showToast("success", "Booking created");
    navigate("/bookings");
  };

  if (!provider) return <div className="page-body">Loading...</div>;

  return (
    <div className="page-body">
      <div className="card">
        <div className="flex items-center gap-4">
          <div className="avatar xl">{(provider.name || "P")[0].toUpperCase()}</div>
          <div>
            <h1 className="text-xl font-bold">{provider.name}</h1>
            <p className="text-muted mt-1">
              {provider.category} • {provider.city || "India"}
            </p>
            <div className="rating-row mt-2">
              <span className="stars">★★★★★</span>
              <span>{Number(provider.rating || 0).toFixed(1)}</span>
              <span className="rating-count">({provider.ratingCount || 0})</span>
            </div>
          </div>
        </div>

        {provider.bio ? <p className="mt-4">{provider.bio}</p> : null}

        <div className="provider-tags mt-4">
          {(provider.tags || []).map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>

        <div className="grid-2 mt-6">
          <div>
            <label className="form-label">Pick date & time</label>
            <input
              type="datetime-local"
              className="form-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <div className="form-label">Starting price</div>
            <div className="price rupee">
              ₹{provider.priceFrom ?? 499}
              <span> / {provider.priceUnit || "visit"}</span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button className="btn btn-primary btn-lg" type="button" onClick={onBook}>
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProviderProfilePage;

