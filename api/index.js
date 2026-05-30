import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { MongoClient } from 'mongodb';

const app = express();
const PORT = process.env.PORT || 5000;
const ADMIN_PASSWORD = 'ruchi2026';
const ADMIN_TOKEN = 'token_ruchi_rani_2026';

const dbPath = path.join(process.cwd(), 'db.json');

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// --- DATABASE ACCESS MANAGER ---
let cachedClient = null;
let cachedDb = null;

// Local JSON File helpers
const readLocalJSON = () => {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading local database:", err);
    return { profile: {}, articles: [] };
  }
};

const writeLocalJSON = (data) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error("Error writing local database:", err);
    return false;
  }
};

// Lazy Connection and Auto-Seeding Cloud Resolver
async function connectToDatabase() {
  if (cachedDb) {
    return { db: cachedDb, client: cachedClient, isCloud: true };
  }
  
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return { db: null, client: null, isCloud: false };
  }

  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('portfolio_db');
    
    // Auto-seed MongoDB from db.json if the database collections are empty
    const collections = await db.listCollections({ name: 'profile' }).toArray();
    if (collections.length === 0) {
      console.log("Seeding MongoDB cloud database with initial data from db.json...");
      const localData = readLocalJSON();
      
      await db.collection('profile').insertOne(localData.profile);
      if (localData.articles.length > 0) {
        await db.collection('articles').insertMany(localData.articles);
      }
      console.log("Auto-seeding completed successfully!");
    }
    
    cachedClient = client;
    cachedDb = db;
    return { db, client, isCloud: true };
  } catch (err) {
    console.error("Database connection error, falling back to local JSON:", err);
    return { db: null, client: null, isCloud: false, error: err.message || String(err) };
  }
}

// Authentication middleware
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader === `Bearer ${ADMIN_TOKEN}`) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized: Admin credentials required' });
  }
};

// --- PUBLIC ROUTES ---

// Fetch profile and clippings
app.get('/api/portfolio', async (req, res) => {
  const { db, isCloud } = await connectToDatabase();
  if (isCloud) {
    try {
      const profileDoc = await db.collection('profile').findOne({});
      const articlesList = await db.collection('articles').find({}).toArray();
      
      if (profileDoc) delete profileDoc._id;
      const cleanArticles = articlesList.map(art => {
        const cleanArt = { ...art };
        delete cleanArt._id;
        return cleanArt;
      });
      
      res.json({ profile: profileDoc || {}, articles: cleanArticles });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch cloud database' });
    }
  } else {
    const local = readLocalJSON();
    res.json(local);
  }
});

// Admin Login
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ token: ADMIN_TOKEN, success: true });
  } else {
    res.status(401).json({ success: false, error: 'Incorrect PIN or Password' });
  }
});

// --- SECURE ADMIN ROUTES ---

// Update Profile Details
app.put('/api/profile', authenticateAdmin, async (req, res) => {
  const { db, isCloud, error: dbError } = await connectToDatabase();
  if (isCloud) {
    try {
      const profileDoc = await db.collection('profile').findOne({});
      if (profileDoc) {
        await db.collection('profile').updateOne({}, { $set: req.body });
      } else {
        await db.collection('profile').insertOne(req.body);
      }
      const updated = await db.collection('profile').findOne({});
      if (updated) delete updated._id;
      res.json({ success: true, message: 'Profile updated in cloud database', profile: updated });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update cloud profile' });
    }
  } else {
    if (process.env.VERCEL) {
      return res.status(500).json({ 
        error: 'Vercel is read-only and MongoDB Cloud is not connected.',
        details: dbError || 'MONGODB_URI environment variable is missing or invalid in Vercel settings.'
      });
    }
    const local = readLocalJSON();
    local.profile = { ...local.profile, ...req.body };
    if (writeLocalJSON(local)) {
      res.json({ success: true, message: 'Profile updated in local JSON', profile: local.profile });
    } else {
      res.status(500).json({ error: 'Failed to write local database' });
    }
  }
});

// Add New Article Card
app.post('/api/articles', authenticateAdmin, async (req, res) => {
  const { db, isCloud, error: dbError } = await connectToDatabase();
  let newId = 1;
  
  if (isCloud) {
    try {
      const articlesList = await db.collection('articles').find({}).toArray();
      if (articlesList.length > 0) {
        newId = Math.max(...articlesList.map(a => a.id || 0)) + 1;
      }
      
      const newArticle = {
        id: newId,
        title: req.body.title || 'Untitled Article',
        description: req.body.description || '',
        link: req.body.link || '#',
        source: req.body.source || 'Freelance',
        date: req.body.date || new Date().toLocaleDateString('en-US'),
        image: req.body.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
        category: req.body.category || 'Travel Writing',
        content: req.body.content || ''
      };
      
      await db.collection('articles').insertOne(newArticle);
      delete newArticle._id;
      res.status(201).json({ success: true, article: newArticle });
    } catch (err) {
      res.status(500).json({ error: 'Failed to add cloud article' });
    }
  } else {
    if (process.env.VERCEL) {
      return res.status(500).json({ 
        error: 'Vercel is read-only and MongoDB Cloud is not connected.',
        details: dbError || 'MONGODB_URI environment variable is missing or invalid in Vercel settings.'
      });
    }
    const local = readLocalJSON();
    newId = local.articles.length > 0 ? Math.max(...local.articles.map(a => a.id)) + 1 : 1;
    const newArticle = {
      id: newId,
      title: req.body.title || 'Untitled Article',
      description: req.body.description || '',
      link: req.body.link || '#',
      source: req.body.source || 'Freelance',
      date: req.body.date || new Date().toLocaleDateString('en-US'),
      image: req.body.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      category: req.body.category || 'Travel Writing',
      content: req.body.content || ''
    };
    local.articles.unshift(newArticle);
    if (writeLocalJSON(local)) {
      res.status(201).json({ success: true, article: newArticle });
    } else {
      res.status(500).json({ error: 'Failed to add article' });
    }
  }
});

// Update Existing Article
app.put('/api/articles/:id', authenticateAdmin, async (req, res) => {
  const id = parseInt(req.params.id);
  const { db, isCloud, error: dbError } = await connectToDatabase();
  
  if (isCloud) {
    try {
      const exists = await db.collection('articles').findOne({ id });
      if (exists) {
        const updatedArticle = { ...exists, ...req.body, id };
        delete updatedArticle._id;
        await db.collection('articles').replaceOne({ id }, updatedArticle);
        res.json({ success: true, article: updatedArticle });
      } else {
        res.status(404).json({ error: 'Article not found' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Failed to update cloud article' });
    }
  } else {
    if (process.env.VERCEL) {
      return res.status(500).json({ 
        error: 'Vercel is read-only and MongoDB Cloud is not connected.',
        details: dbError || 'MONGODB_URI environment variable is missing or invalid in Vercel settings.'
      });
    }
    const local = readLocalJSON();
    const index = local.articles.findIndex(a => a.id === id);
    if (index !== -1) {
      local.articles[index] = { ...local.articles[index], ...req.body, id };
      if (writeLocalJSON(local)) {
        res.json({ success: true, article: local.articles[index] });
      } else {
        res.status(500).json({ error: 'Failed to update database' });
      }
    } else {
      res.status(404).json({ error: 'Article not found' });
    }
  }
});

// Delete Article
app.delete('/api/articles/:id', authenticateAdmin, async (req, res) => {
  const id = parseInt(req.params.id);
  const { db, isCloud, error: dbError } = await connectToDatabase();
  
  if (isCloud) {
    try {
      const result = await db.collection('articles').deleteOne({ id });
      if (result.deletedCount > 0) {
        res.json({ success: true, message: 'Article deleted from cloud database' });
      } else {
        res.status(404).json({ error: 'Article not found' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete cloud article' });
    }
  } else {
    if (process.env.VERCEL) {
      return res.status(500).json({ 
        error: 'Vercel is read-only and MongoDB Cloud is not connected.',
        details: dbError || 'MONGODB_URI environment variable is missing or invalid in Vercel settings.'
      });
    }
    const local = readLocalJSON();
    const initialLength = local.articles.length;
    local.articles = local.articles.filter(a => a.id !== id);
    if (local.articles.length < initialLength) {
      if (writeLocalJSON(local)) {
        res.json({ success: true, message: 'Article deleted from local JSON' });
      } else {
        res.status(500).json({ error: 'Failed to write updates' });
      }
    } else {
      res.status(404).json({ error: 'Article not found' });
    }
  }
});

// Listen locally only if process.env.VERCEL is not defined
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Backend Express server is running on port ${PORT}`);
  });
}

export default app;
