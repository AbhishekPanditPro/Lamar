
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const fsExtra = require('fs-extra');
const { createPool } = require('mysql2/promise');
const cors = require('cors');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');

// Configure multer for file upload
const upload = multer({ dest: 'uploads/' });

// Create MySQL connection pool
const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

app.use(cors());

// Parsing middleware
app.use(bodyParser.json());

// New account creation endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  // console.log(email,password);
  
  // Query to find the user with the provided email
  pool.query('SELECT * FROM users WHERE email = ? and password = ?', [email,password], (err, results) => {
    if (err) {
      // Handle the SQL error
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Check if any user is found and if the password matches\
    console.log(results);
    if (results.length > 0 && results[0].Password === password) {
      // Assuming plaintext passwords for the example. Use hashed passwords in production.
      res.json({ found: true,
        namee: results[0].FirstName});
      
    } else {
      // No user found or password does not match
      res.json({ found: false });
    }
  });
});


// Placeholder AI analysis function
async function analyzeImageWithAI(imagePath) {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Simulated response
  return "This is a simulated response from the AI analysis.";
}

// Endpoint to handle image analysis
app.post('/analyze-image', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No image uploaded.');
  }

  try {
    const imagePath = req.file.path;
    const description = await analyzeImageWithAI(imagePath);
    
    res.json({ description });

    // Clean up the uploaded file
    await fsExtra.remove(imagePath);
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).send('Error processing image.');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
