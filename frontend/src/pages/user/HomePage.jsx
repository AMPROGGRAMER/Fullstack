import React, { useEffect, useMemo, useState } from "react";
import ProviderCard from "../../components/cards/ProviderCard.jsx";
import { fetchProviders } from "../../services/providerService.js";

const HomePage = () => {
  const [providers, setProviders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchProviders();
        setProviders(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return providers;
    return providers.filter((p) => (p.name || "").toLowerCase().includes(q));
  }, [providers, search]);

  return (
    <div className="page-body">
      <section className="hero">
        <div className="hero-content">
          <h1>
            Find trusted <span>local professionals</span>
          </h1>
          <p>
            Search plumbers, cleaners, electricians, tutors, packers & movers and more —
            inspired by your original HTML UI.
          </p>
          <div className="hero-search">
            <div className="search-bar">
              <input
                placeholder="Search providers (e.g. Ramesh Plumber)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="search-btn" type="button">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="section-title">Top professionals</h2>

        {loading ? (
          <div className="text-muted">Loading providers...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No providers found</h3>
            <p>Try another search.</p>
          </div>
        ) : (
          <div className="grid-auto">
            {filtered.map((p) => (
              <ProviderCard key={p._id} provider={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;

