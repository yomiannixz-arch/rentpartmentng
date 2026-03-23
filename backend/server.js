require('dotenv').config()

const express = require('express')
const cors = require('cors')
const pool = require('./db')

const app = express()
const PORT = process.env.PORT || 10000

app.use(express.json())

const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:5173'].filter(Boolean)

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true)
      if (allowedOrigins.includes(origin)) return callback(null, true)
      return callback(new Error(`CORS blocked for origin: ${origin}`))
    },
  })
)

app.get('/', (req, res) => {
  res.json({ ok: true, message: 'RentConnect backend is running' })
})

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1')
    res.json({ ok: true, database: 'connected' })
  } catch (error) {
    console.error('Health check error:', error)
    res.status(500).json({ ok: false, error: error.message })
  }
})

app.get('/api/properties', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, title, area, address, annual_rent, beds, baths, type, verified, image, description, inspection_fee
      FROM properties
      ORDER BY id DESC
    `)

    const properties = result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      area: row.area,
      address: row.address,
      annualRent: Number(row.annual_rent),
      beds: Number(row.beds),
      baths: Number(row.baths),
      type: row.type,
      verified: row.verified,
      image: row.image,
      description: row.description,
      inspectionFee: Number(row.inspection_fee),
    }))

    res.json(properties)
  } catch (error) {
    console.error('GET /api/properties error:', error)
    res.status(500).json({ ok: false, error: error.message })
  }
})

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ ok: false, error: err.message || 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
