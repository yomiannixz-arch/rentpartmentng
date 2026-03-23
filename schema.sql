CREATE TABLE IF NOT EXISTS properties (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  area TEXT NOT NULL,
  address TEXT NOT NULL,
  annual_rent NUMERIC NOT NULL,
  beds INTEGER NOT NULL,
  baths INTEGER NOT NULL,
  type TEXT NOT NULL,
  verified BOOLEAN DEFAULT true,
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  inspection_fee NUMERIC NOT NULL
);

INSERT INTO properties
(title, area, address, annual_rent, beds, baths, type, verified, image, description, inspection_fee)
VALUES
(
  '2 Bedroom Apartment in Lekki Phase 1',
  'Lekki',
  'Admiralty Way, Lekki Phase 1, Lagos',
  3500000,
  2,
  2,
  'Apartment',
  true,
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
  'Spacious 2-bedroom apartment with parking, fitted kitchen, and 24/7 security.',
  5000
),
(
  'Mini Flat in Yaba',
  'Yaba',
  'Herbert Macaulay Way, Yaba, Lagos',
  1800000,
  1,
  1,
  'Mini Flat',
  true,
  'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
  'Clean mini flat close to transport, schools, and business hubs.',
  3000
),
(
  'Self Contain in Ikeja',
  'Ikeja',
  'Allen Avenue, Ikeja, Lagos',
  950000,
  1,
  1,
  'Self Contain',
  true,
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
  'Affordable self-contain apartment in a central Ikeja location.',
  2500
);
