require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
  })
);

app.get("/", (req, res) => {
  res.json({ ok: true, message: "RentConnect backend is running" });
});

app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true, database: "connected" });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.get("/api/properties", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        title,
        area,
        address,
        annual_rent,
        beds,
        baths,
        type,
        verified,
        image,
        description,
        inspection_fee
      FROM properties
      ORDER BY id DESC
    `);

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
    }));

    res.json(properties);
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.get("/api/applications", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, property_id, property_title, name, email, phone, move_in_date, message, created_at
      FROM applications
      ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.post("/api/applications", async (req, res) => {
  try {
    const { propertyId, propertyTitle, name, email, phone, moveInDate, message } = req.body;

    const result = await pool.query(
      `
      INSERT INTO applications
      (property_id, property_title, name, email, phone, move_in_date, message)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
      [propertyId, propertyTitle, name, email, phone, moveInDate, message]
    );

    res.status(201).json({ ok: true, application: result.rows[0] });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
