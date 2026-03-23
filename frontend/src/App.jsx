import { useEffect, useMemo, useState } from 'react'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

function formatNGN(value) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))
}

export default function App() {
  const [properties, setProperties] = useState([])
  const [search, setSearch] = useState('')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    async function fetchProperties() {
      try {
        setLoading(true)
        setError('')

        const url = API_BASE_URL ? `${API_BASE_URL}/api/properties` : '/api/properties'
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const data = await response.json()
        setProperties(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Failed to load properties:', err)
        setError('Unable to load listings right now. Check your backend URL and redeploy.')
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return properties.filter((property) => {
      const matchesSearch = !q || [
        property.title,
        property.area,
        property.address,
        property.type,
      ].some((field) => String(field || '').toLowerCase().includes(q))

      const matchesVerified = !verifiedOnly || property.verified
      return matchesSearch && matchesVerified
    })
  }, [properties, search, verifiedOnly])

  return (
    <div className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">RentConnect NG</p>
          <h1>Lagos apartment rental hub</h1>
          <p className="hero-text">
            Verified apartment listings across Lekki, Yaba, Ikeja, Surulere, and more.
          </p>
        </div>
        <div className="hero-card">
          <div className="search-block">
            <input
              type="text"
              placeholder="Search by area, address, or apartment type"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <label className="toggle-row">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
              />
              Verified listings only
            </label>
          </div>
          <div className="stat-grid">
            <div>
              <strong>{properties.length}</strong>
              <span>Total listings</span>
            </div>
            <div>
              <strong>{filtered.length}</strong>
              <span>Matching now</span>
            </div>
          </div>
        </div>
      </header>

      <main>
        {loading && <div className="notice">Loading listings...</div>}
        {!loading && error && <div className="notice error">{error}</div>}
        {!loading && !error && filtered.length === 0 && (
          <div className="notice">No listings matched your current search.</div>
        )}

        <section className="grid">
          {filtered.map((property) => (
            <article className="card" key={property.id}>
              <img src={property.image} alt={property.title} className="card-image" />
              <div className="card-body">
                <div className="pill-row">
                  <span className="pill pill-area">{property.area}</span>
                  {property.verified ? <span className="pill pill-verified">Verified</span> : null}
                </div>
                <h2>{property.title}</h2>
                <p className="muted">{property.address}</p>
                <p className="price">{formatNGN(property.annualRent)} <span>/ year</span></p>
                <p className="meta">{property.beds} bed · {property.baths} bath · {property.type}</p>
                <button className="primary-button" onClick={() => setSelected(property)}>
                  View details
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>

      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setSelected(null)}>×</button>
            <img src={selected.image} alt={selected.title} className="modal-image" />
            <div className="modal-body">
              <div className="pill-row">
                <span className="pill pill-area">{selected.area}</span>
                {selected.verified ? <span className="pill pill-verified">Verified listing</span> : null}
              </div>
              <h2>{selected.title}</h2>
              <p className="muted">{selected.address}</p>
              <p className="price">{formatNGN(selected.annualRent)} <span>/ year</span></p>
              <p>{selected.description}</p>
              <div className="inspection-box">
                <h3>Book inspection</h3>
                <p className="muted">Inspection fee: {formatNGN(selected.inspectionFee)}</p>
                <div className="form-grid">
                  <input type="text" placeholder="Full name" />
                  <input type="tel" placeholder="Phone number" />
                  <input type="date" />
                  <button className="primary-button" type="button">Book now</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
