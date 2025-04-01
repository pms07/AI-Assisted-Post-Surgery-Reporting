import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);

const pool = mysql.createPool({
  host: process.env.DB_HOST,         
  user: process.env.DB_USER,        
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME,    
});

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// GET /articles route - Fetch all articles
app.get('/saved-articles', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM articles');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching articles:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /articles route - Insert a new article
app.post('/articles', async (req, res) => {
  try {
    const { article_title, article_data } = req.body;
    if (!article_title || !article_data) {
      return res.status(400).json({ error: 'Missing required fields: article_title and article_data' });
    }
    const [result] = await pool.query(
      'INSERT INTO articles (article_title, article_data) VALUES (?, ?)',
      [article_title, article_data]
    );
    res.status(201).json({ id: result.insertId, article_title, article_data });
  } catch (err) {
    console.error('Error saving article:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
