import { useEffect, useMemo, useState } from "react";
import "./styles.css";

function formatNGN(amount) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function App() {
  const [listings, setListings] = useState([]);
  const [query, setQuery] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadListings() {
      try {
        setError("");
        const res = await fetch(`${API_BASE}/api/properties`);
        if (!res.ok) throw new Error("Failed to fetch listings");
        const data = await res.json();
        setListings(data);
      } catch (err) {
        setError("Unable to load listings right now. Check your backend URL and redeploy.");
      }
    }
    loadListings();
  }, []);

  const filtered = useMemo(() => {
    return listings.filter((item) => {
      const matchesQuery =
        !query ||
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.area.toLowerCase().includes(query.toLowerCase()) ||
        item.address.toLowerCase().includes(query.toLowerCase()) ||
        item.type.toLowerCase().includes(query.toLowerCase());

      const matchesVerified = !verifiedOnly || item.verified;
      return matchesQuery && matchesVerified;
    });
  }, [listings, query, verifiedOnly]);

  return (
    <main className="app-shell">
      <section className="hero">
        <div className="hero-copy">
          <span className="brand">RentConnect NG</span>
          <h1 className="hero-title">Lagos apartment rental hub</h1>
          <p className="hero-subtitle">
            Verified apartment listings across Lekki, Yaba, Ikeja, Surulere, and more.
          </p>
        </div>

        <aside className="hero-panel">
          <input
            className="search-input"
            type="text"
            placeholder="Search by area, address, or apartment type"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <div className="filter-row">
            <label className="checkbox-wrap">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
              />
              <span>Verified listings only</span>
            </label>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <p className="stat-value">{listings.length}</p>
              <p className="stat-label">Total listings</p>
            </div>
            <div className="stat-card">
              <p className="stat-value">{filtered.length}</p>
              <p className="stat-label">Matching now</p>
            </div>
          </div>
        </aside>
      </section>

      {error ? <div className="feedback error">{error}</div> : null}

      <section className="listings-grid">
        {filtered.length === 0 ? (
          <div className="empty-state">No listings matched your search.</div>
        ) : (
          filtered.map((item) => (
            <article key={item.id} className="listing-card">
              <img className="listing-image" src={item.image} alt={item.title} />
              <div className="listing-body">
                <div className="tag-row">
                  <span className="tag area">{item.area}</span>
                  {item.verified ? <span className="tag verified">Verified</span> : null}
                </div>

                <h2 className="listing-title">{item.title}</h2>
                <p className="listing-address">{item.address}</p>
                <p className="listing-price">
                  {formatNGN(item.annualRent)} <span>/ year</span>
                </p>
                <p className="listing-meta">
                  {item.beds} bed · {item.baths} bath · {item.type}
                </p>

                <button className="primary-btn" type="button">
                  View details
                </button>
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
