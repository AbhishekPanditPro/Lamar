require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fsExtra = require('fs-extra');
const multer = require('multer');
const mysql = require('mysql2/promise');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
const upload = multer({ dest: 'uploads/' });

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  socketPath: '/cloudsql/silver-axon-417822:us-east5:serverapi',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Placeholder for analyzing an image with an AI service
async function analyzeImageWithAI(imagePath) {
  // Simulated delay and response
  await new Promise(resolve => setTimeout(resolve, 1000));
  return "This is a simulated AI response for image analysis.";
}

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [results] = await pool.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
    if (results.length > 0 && results[0].password === password) { // Make sure to use the correct column name for password
      res.json({ found: true, name: results[0].firstname }); // Adjust 'firstname' as per your column name
    } else {
      res.json({ found: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Account creation endpoint
app.post('/newaccount', async (req, res) => {
  const { email, firstname, lastname, password } = req.body;
  try {
    const [results] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (results.length == 0) {
      await pool.query('INSERT INTO users (email, firstname, lastname, password) VALUES (?, ?, ?, ?)', [email, firstname, lastname, password]);
      res.json({ created: true });
    } else {
      res.json({ created: false, message: 'Email already exists.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Image analysis endpoint
app.post('/analyze-image', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No image uploaded.');
  }
  try {
    const imagePath = req.file.path;
    const description = await analyzeImageWithAI(imagePath);
    res.json({ description });
    fsExtra.emptyDirSync('./uploads');
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).send('Error processing image.');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


// createTcpPool initializes a TCP connection pool for a Cloud SQL
// instance of MySQL.
const createTcpPool = async config => {
  // Note: Saving credentials in environment variables is convenient, but not
  // secure - consider a more secure solution such as
  // Cloud Secret Manager (https://cloud.google.com/secret-manager) to help
  // keep secrets safe.
  const dbConfig = {
    host: process.env.INSTANCE_HOST, // e.g. '127.0.0.1'
    port: process.env.DB_PORT, // e.g. '3306'
    user: process.env.DB_USER, // e.g. 'my-db-user'
    password: process.env.DB_PASS, // e.g. 'my-db-password'
    database: process.env.DB_NAME, // e.g. 'my-database'
    // ... Specify additional properties here.
    ...config,
  };
  // Establish a connection to the database.
  return mysql.createPool(dbConfig);
};