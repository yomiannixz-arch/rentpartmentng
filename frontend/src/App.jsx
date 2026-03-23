import { useEffect, useMemo, useState } from "react";
import "./styles.css";

const API = import.meta.env.VITE_API_BASE_URL;

const lagosAreas = [
  "All",
  "Lekki",
  "Yaba",
  "Ikeja",
  "Surulere",
  "Ogba",
  "Ikorodu",
  "Shomolu",
  "Gbagada",
  "Ikoyi",
  "Apapa",
  "Ajah",
  "Maryland",
  "Magodo",
  "Festac",
  "Amuwo Odofin",
  "Ojodu",
  "Sangotedo",
  "Victoria Island",
  "Chevron",
  "Oshodi",
  "Mushin",
  "Bariga"
];

const propertyTypes = [
  "All",
  "Apartment",
  "Mini Flat",
  "Self Contain",
  "Duplex",
  "Shortlet",
  "Serviced Apartment",
  "Airbnb-style"
];

function formatNGN(amount) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0
  }).format(Number(amount || 0));
}

export default function App() {
  const [listings, setListings] = useState([]);
  const [applications, setApplications] = useState([]);
  const [query, setQuery] = useState("");
  const [area, setArea] = useState("All");
  const [type, setType] = useState("All");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [maxBudget, setMaxBudget] = useState(10000000);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);

  useEffect(() => {
    async function loadListings() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`${API}/api/properties`);
        if (!res.ok) throw new Error("Failed to fetch listings");
        const data = await res.json();
        setListings(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Unable to load listings right now.");
      } finally {
        setLoading(false);
      }
    }

    loadListings();
  }, []);

  const filtered = useMemo(() => {
    return listings.filter((item) => {
      const q = query.trim().toLowerCase();

      const matchesQuery =
        !q ||
        item.title?.toLowerCase().includes(q) ||
        item.area?.toLowerCase().includes(q) ||
        item.address?.toLowerCase().includes(q) ||
        item.type?.toLowerCase().includes(q);

      const matchesArea = area === "All" || item.area === area;
      const matchesType = type === "All" || item.type === type;
      const matchesVerified = !verifiedOnly || item.verified;
      const matchesBudget =
        Number(item.annualRent || item.price || 0) <= maxBudget;

      return (
        matchesQuery &&
        matchesArea &&
        matchesType &&
        matchesVerified &&
        matchesBudget
      );
    });
  }, [listings, query, area, type, verifiedOnly, maxBudget]);

  function openWhatsApp(property) {
    const text = `Hello, I am interested in "${property.title}" located at ${property.address} in ${property.area}. Please share inspection and availability details.`;
    window.open(
      `https://wa.me/2348087156505?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  }

  async function submitApplication(e) {
    e.preventDefault();
    if (!selected) return;

    const form = new FormData(e.currentTarget);
    const payload = {
      propertyId: selected.id,
      propertyTitle: selected.title,
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone"),
      moveInDate: form.get("moveInDate"),
      message: form.get("message")
    };

    try {
      setApplications((prev) => [{ id: Date.now(), ...payload }, ...prev]);

      await fetch(`${API}/api/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }).catch(() => null);

      const mailtoSubject = `New apartment application - ${selected.title}`;
      const mailtoBody = `Name: ${payload.name}
Email: ${payload.email}
Phone: ${payload.phone}
Move-in Date: ${payload.moveInDate}
Property: ${payload.propertyTitle}
Message: ${payload.message}`;

      window.open(
        `mailto:yomiannixz@gmail.com?subject=${encodeURIComponent(mailtoSubject)}&body=${encodeURIComponent(mailtoBody)}`,
        "_blank"
      );

      alert("Application submitted.");
      setSelected(null);
      e.currentTarget.reset();
    } catch (err) {
      alert("Application could not be completed.");
    }
  }

  function loginAdmin(e) {
    e.preventDefault();
    if (adminPass === "admin123") {
      setAdminLoggedIn(true);
    } else {
      alert("Wrong admin password");
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-wrap">
          <span className="brand-badge">RentConnect NG</span>
          <button
            className="admin-link"
            onClick={() => setAdminOpen(true)}
            type="button"
          >
            Admin
          </button>
        </div>
      </header>

     <section className="hero hero-banner">
  <div className="hero-main">
    <h1 className="hero-title">Lagos apartment rental hub</h1>
    <p className="hero-subtitle">
      Verified apartments, shortlets, serviced apartments, and Airbnb-style stays
      across Lekki, Yaba, Ikeja, Ikoyi, Gbagada, Ogba, Ikorodu, Apapa, and more.
    </p>

    <div className="hero-actions">
      <button
        className="hero-btn primary"
        onClick={() => window.scrollTo({ top: 780, behavior: "smooth" })}
        type="button"
      >
        Browse listings
      </button>

      <button
        className="hero-btn secondary"
        onClick={() =>
          openWhatsApp({
            title: "General apartment inquiry",
            address: "Lagos",
            area: "Lagos"
          })
        }
        type="button"
      >
        WhatsApp us
      </button>
    </div>
  </div>

  <aside className="filter-panel">
    <h3>Quick filter</h3>

    <input
      className="control"
      type="text"
      placeholder="Search by title, area, address"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />

    <div className="filter-grid">
      <select
        className="control"
        value={area}
        onChange={(e) => setArea(e.target.value)}
      >
        {lagosAreas.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>

      <select
        className="control"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        {propertyTypes.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
    </div>

    <label className="checkbox-wrap">
      <input
        type="checkbox"
        checked={verifiedOnly}
        onChange={(e) => setVerifiedOnly(e.target.checked)}
      />
      <span>Verified listings only</span>
    </label>

    <div className="budget-wrap">
      <label>
        Budget up to: <strong>{formatNGN(maxBudget)}</strong>
      </label>
      <input
        type="range"
        min="500000"
        max="10000000"
        step="250000"
        value={maxBudget}
        onChange={(e) => setMaxBudget(Number(e.target.value))}
      />
    </div>

    <div className="stats-grid">
      <div className="stat-card">
        <strong>{listings.length}</strong>
        <span>Total listings</span>
      </div>
      <div className="stat-card">
        <strong>{filtered.length}</strong>
        <span>Matching now</span>
      </div>
    </div>
  </aside>
</section>
      
      <section className="feature-row">
        <div className="feature-card">
          <h3>Available property types</h3>
          <p>
            Apartment, Mini Flat, Duplex, Self Contain, Shortlet, Serviced
            Apartment, Airbnb-style.
          </p>
        </div>
        <div className="feature-card">
          <h3>Notifications</h3>
          <p>
            Applications can notify WhatsApp at 08087156505 and send
            email-ready alerts to yomiannixz@gmail.com.
          </p>
        </div>
        <div className="feature-card">
          <h3>Admin review</h3>
          <p>
            Admins can log in, review submitted applications, and monitor
            listing demand.
          </p>
        </div>
      </section>

      {error ? <div className="feedback error">{error}</div> : null}
      {loading ? <div className="feedback">Loading listings...</div> : null}

      <section className="listings-grid">
        {filtered.map((item) => (
          <article className="listing-card" key={item.id}>
            <img className="listing-image" src={item.image} alt={item.title} />
            <div className="listing-body">
              <div className="tag-row">
                <span className="tag area">{item.area}</span>
                {item.verified ? (
                  <span className="tag verified">Verified</span>
                ) : null}
                <span className="tag type">{item.type}</span>
              </div>

              <h2 className="listing-title">{item.title}</h2>
              <p className="listing-address">{item.address}</p>

              <p className="listing-price">
                {formatNGN(item.annualRent || item.price)}{" "}
                <span>
                  {item.type === "Shortlet" ||
                  item.type === "Serviced Apartment" ||
                  item.type === "Airbnb-style"
                    ? "/ stay"
                    : "/ year"}
                </span>
              </p>

              <p className="listing-meta">
                {item.beds} bed · {item.baths} bath
              </p>

              <div className="card-actions">
                <button
                  className="primary-btn"
                  type="button"
                  onClick={() => setSelected(item)}
                >
                  Apply now
                </button>
                <button
                  className="secondary-btn"
                  type="button"
                  onClick={() => openWhatsApp(item)}
                >
                  WhatsApp
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      {selected ? (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-btn"
              onClick={() => setSelected(null)}
              type="button"
            >
              ×
            </button>
            <h2>Apply for {selected.title}</h2>
            <p>{selected.address}</p>

            <form className="application-form" onSubmit={submitApplication}>
              <input
                name="name"
                className="control"
                placeholder="Full name"
                required
              />
              <input
                name="email"
                className="control"
                placeholder="Email address"
                type="email"
                required
              />
              <input
                name="phone"
                className="control"
                placeholder="Phone number"
                required
              />
              <input
                name="moveInDate"
                className="control"
                type="date"
                required
              />
              <textarea
                name="message"
                className="control textarea"
                placeholder="Tell us what you need"
              />

              <button className="primary-btn" type="submit">
                Submit application
              </button>
            </form>
          </div>
        </div>
      ) : null}

      {adminOpen ? (
        <div className="modal-backdrop" onClick={() => setAdminOpen(false)}>
          <div
            className="modal-card admin-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-btn"
              onClick={() => setAdminOpen(false)}
              type="button"
            >
              ×
            </button>

            {!adminLoggedIn ? (
              <>
                <h2>Admin login</h2>
                <form onSubmit={loginAdmin} className="application-form">
                  <input
                    className="control"
                    type="password"
                    placeholder="Admin password"
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                  />
                  <button className="primary-btn" type="submit">
                    Login
                  </button>
                </form>
              </>
            ) : (
              <>
                <h2>Admin dashboard</h2>
                <div className="admin-stats">
                  <div className="stat-card">
                    <strong>{applications.length}</strong>
                    <span>Applications</span>
                  </div>
                  <div className="stat-card">
                    <strong>{listings.length}</strong>
                    <span>Listings</span>
                  </div>
                </div>

                <div className="admin-list">
                  {applications.length === 0 ? (
                    <p>No applications yet.</p>
                  ) : (
                    applications.map((app) => (
                      <div className="admin-item" key={app.id}>
                        <strong>{app.name}</strong>
                        <p>
                          {app.email} · {app.phone}
                        </p>
                        <p>{app.propertyTitle}</p>
                        <p>{app.moveInDate}</p>
                        <p>{app.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}
    </main>
  );
}
