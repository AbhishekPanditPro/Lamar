const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
require('dotenv').config();


// const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs'); 


const fsExtra = require('fs-extra');


const multer = require('multer');


const app = express();
const port = 3000;

// Use cors middleware to allow cross-origin requests
app.use(cors());

// Parsing middleware
app.use(bodyParser.json());

// MySQL connection
const connection = mysql.createPool({
  host: 'localhost', // e.g., localhost
  user: 'root',
  password: 'givemeaccess',
  database: 'ServerAPI'
});





// New account creation endpoint
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    // console.log(email,password);
    
    // Query to find the user with the provided email
    connection.query('SELECT * FROM users WHERE email = ? and password = ?', [email,password], (err, results) => {
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


app.post('/newaccount', (req, res) => {
  const { email, firstname, lastname, password } = req.body;
  console.log(email,firstname, lastname, password);
  
  // Query to find the user with the provided email
  connection.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      
      // Handle the SQL error
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    console.log(results);
    if (results.length == 0){
      // this means that there is no any one with that email
      // res.json({ found: true });
      const query = `INSERT INTO users (email,firstname,lastname,password) VALUES (?,?,?,?)`;
      connection.query(query,[email,firstname,lastname,password],(error,result)=>{
          if(error){
              return res.status(500).json({ error: 'Internal server error' });
          
          }
          res.json({found:false});

      })
      

    }else{
      // this means that there is data with that email
      res.json({found: true});

    }
  });
});

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Converts local file information to a GoogleGenerativeAI.Part object.
function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType
    },
  };
}

async function run(Image) {
  // For text-and-image input (multimodal), use the gemini-pro-vision model
  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
  
  const prompt = "What is in the picture? Can you elaborate in depth and help me understand it?";
  
  const imageParts = [
    fileToGenerativePart(Image,"image/jpeg"),
    // fileToGenerativePart("image2.jpeg", "image/jpeg"),
  ];
  
  const result = await model.generateContent([prompt, ...imageParts]);
  const response = await result.response;
  const text = response.text();
  console.log(text);
  return text;
}
  

const upload = multer({ dest: './uploads/' }); // Temporarily store files in 'uploads'



app.post('/analyze-image', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No image uploaded.');
  }

  try {
    // Adjust this to the actual path where multer saves files
    const imagePath = req.file.path;

    // Now, call your AI function and pass the image path
    const description = await run(imagePath); // Assuming run() is modified to accept imagePath
    
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
