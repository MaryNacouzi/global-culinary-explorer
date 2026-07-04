// server.js
// The Global Culinary Explorer & Smart Grocery Assistant
// Node.js + Express backend — serves static frontend and proxies/manages
// all persistence through a serverless Neon PostgreSQL database.

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const { Pool } = require('pg');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- Middleware ----------
app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ---------- Anonymous session isolation (Grocery Assistant) ----------
// Each browser is assigned a random, unguessable session id on first visit,
// stored in an httpOnly cookie. Every grocery item is tagged with the
// session id that created it, so one visitor's checklist never leaks into
// or gets overwritten by another visitor's.
const SESSION_COOKIE = 'gce_session';

app.use((req, res, next) => {
  let sessionId = req.cookies[SESSION_COOKIE];
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    res.cookie(SESSION_COOKIE, sessionId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 365 * 24 * 60 * 60 * 1000 // 1 year
    });
  }
  req.sessionId = sessionId;
  next();
});

// ---------- Neon PostgreSQL connection ----------
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// ---------- Spoonacular proxy (keeps API key off the client) ----------
const SPOONACULAR_KEY = process.env.SPOONACULAR_API_KEY;

app.get('/api/spoonacular/search', async (req, res) => {
  const { query = '', number = 12 } = req.query;
  if (!SPOONACULAR_KEY) {
    return res.status(500).json({ error: 'Server missing SPOONACULAR_API_KEY' });
  }
  if (!query.trim()) {
    return res.status(400).json({ error: 'A search query is required' });
  }
  try {
    const url = `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(
      query
    )}&number=${number}&addRecipeInformation=true&apiKey=${SPOONACULAR_KEY}`;
    const spoonRes = await fetch(url);
    if (!spoonRes.ok) {
      const errBody = await spoonRes.text();
      return res.status(spoonRes.status).json({ error: 'Spoonacular request failed', details: errBody });
    }
    const data = await spoonRes.json();
    res.json(data);
  } catch (err) {
    console.error('Spoonacular proxy error:', err);
    res.status(500).json({ error: 'Failed to fetch recipe data' });
  }
});

app.get('/api/spoonacular/recipe/:id', async (req, res) => {
  const { id } = req.params;
  if (!SPOONACULAR_KEY) {
    return res.status(500).json({ error: 'Server missing SPOONACULAR_API_KEY' });
  }
  try {
    const url = `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=false&apiKey=${SPOONACULAR_KEY}`;
    const spoonRes = await fetch(url);
    if (!spoonRes.ok) {
      const errBody = await spoonRes.text();
      return res.status(spoonRes.status).json({ error: 'Spoonacular request failed', details: errBody });
    }
    const data = await spoonRes.json();
    res.json(data);
  } catch (err) {
    console.error('Spoonacular detail proxy error:', err);
    res.status(500).json({ error: 'Failed to fetch recipe details' });
  }
});

// ---------- Recipe Lab routes (Neon: user_recipes) ----------
app.get('/api/recipes', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM user_recipes ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('GET /api/recipes error:', err);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

app.get('/api/recipes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM user_recipes WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('GET /api/recipes/:id error:', err);
    res.status(500).json({ error: 'Failed to fetch recipe' });
  }
});

app.post('/api/recipes', async (req, res) => {
  const { title, author, category, ingredients, instructions, prep_time_minutes } = req.body;

  if (!title || !author || !category || !ingredients || !instructions || !prep_time_minutes) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO user_recipes (title, author, category, ingredients, instructions, prep_time_minutes)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, author, category, ingredients, instructions, prep_time_minutes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('POST /api/recipes error:', err);
    res.status(500).json({ error: 'Failed to save recipe' });
  }
});

// ---------- Grocery Assistant routes (Neon: grocery_list) — full CRUD, per-session ----------
app.get('/api/grocery', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM grocery_list WHERE session_id = $1 ORDER BY created_at ASC',
      [req.sessionId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('GET /api/grocery error:', err);
    res.status(500).json({ error: 'Failed to fetch grocery list' });
  }
});

app.post('/api/grocery', async (req, res) => {
  const { item_name, quantity } = req.body;
  if (!item_name) {
    return res.status(400).json({ error: 'item_name is required' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO grocery_list (item_name, quantity, session_id) VALUES ($1, $2, $3) RETURNING *`,
      [item_name, quantity || '1', req.sessionId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('POST /api/grocery error:', err);
    res.status(500).json({ error: 'Failed to add item' });
  }
});

app.put('/api/grocery/:id', async (req, res) => {
  const { id } = req.params;
  const { is_checked } = req.body;
  try {
    const result = await pool.query(
      `UPDATE grocery_list SET is_checked = $1 WHERE id = $2 AND session_id = $3 RETURNING *`,
      [is_checked, id, req.sessionId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('PUT /api/grocery/:id error:', err);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

app.delete('/api/grocery/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM grocery_list WHERE id = $1 AND session_id = $2 RETURNING *',
      [id, req.sessionId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ deleted: true, item: result.rows[0] });
  } catch (err) {
    console.error('DELETE /api/grocery/:id error:', err);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// ---------- Fallback for direct page loads ----------
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(__dirname, 'public', 'index.html'), (err) => {
    if (err) next();
  });
});

app.listen(PORT, () => {
  console.log(`Global Culinary Explorer server running on port ${PORT}`);
});
