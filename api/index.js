import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 5000;
const ADMIN_PASSWORD = 'ruchi2026';
const ADMIN_TOKEN = 'token_ruchi_rani_2026';

// Resolve database path dynamically (root of repository)
const dbPath = path.join(process.cwd(), 'db.json');

app.use(cors());
app.use(bodyParser.json());

// Helper function to read DB
const readDB = () => {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading database:", err);
    return { profile: {}, articles: [] };
  }
};

// Helper function to write DB
const writeDB = (data) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error("Error writing database:", err);
    return false;
  }
};

// Authentication middleware for write endpoints
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader === `Bearer ${ADMIN_TOKEN}`) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized: Admin authentication required' });
  }
};

// --- PUBLIC ROUTES ---

app.get('/api/portfolio', (req, res) => {
  const db = readDB();
  res.json(db);
});

app.post('/api/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ token: ADMIN_TOKEN, success: true });
  } else {
    res.status(401).json({ success: false, error: 'Incorrect PIN or Password' });
  }
});

// --- SECURE ADMIN ROUTES ---

app.put('/api/profile', authenticateAdmin, (req, res) => {
  const db = readDB();
  db.profile = { ...db.profile, ...req.body };
  if (writeDB(db)) {
    res.json({ success: true, message: 'Profile updated successfully', profile: db.profile });
  } else {
    res.status(500).json({ error: 'Failed to update database' });
  }
});

app.post('/api/articles', authenticateAdmin, (req, res) => {
  const db = readDB();
  const newArticle = {
    id: db.articles.length > 0 ? Math.max(...db.articles.map(a => a.id)) + 1 : 1,
    title: req.body.title || 'Untitled Article',
    description: req.body.description || '',
    link: req.body.link || '#',
    source: req.body.source || 'Freelance',
    date: req.body.date || new Date().toLocaleDateString('en-US'),
    image: req.body.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
    category: req.body.category || 'Travel Writing'
  };
  
  db.articles.unshift(newArticle);
  if (writeDB(db)) {
    res.status(201).json({ success: true, article: newArticle });
  } else {
    res.status(500).json({ error: 'Failed to add article to database' });
  }
});

app.put('/api/articles/:id', authenticateAdmin, (req, res) => {
  const id = parseInt(req.params.id);
  const db = readDB();
  const index = db.articles.findIndex(a => a.id === id);
  
  if (index !== -1) {
    db.articles[index] = { ...db.articles[index], ...req.body, id };
    if (writeDB(db)) {
      res.json({ success: true, article: db.articles[index] });
    } else {
      res.status(500).json({ error: 'Failed to update database' });
    }
  } else {
    res.status(404).json({ error: `Article with ID ${id} not found` });
  }
});

app.delete('/api/articles/:id', authenticateAdmin, (req, res) => {
  const id = parseInt(req.params.id);
  const db = readDB();
  const initialLength = db.articles.length;
  db.articles = db.articles.filter(a => a.id !== id);
  
  if (db.articles.length < initialLength) {
    if (writeDB(db)) {
      res.json({ success: true, message: `Article ${id} deleted successfully` });
    } else {
      res.status(500).json({ error: 'Failed to write updates to database' });
    }
  } else {
    res.status(404).json({ error: `Article with ID ${id} not found` });
  }
});

// Boot Server only if not running inside Vercel serverless environment
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Backend Express server is running on port ${PORT}`);
  });
}

export default app;
