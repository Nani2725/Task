const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const USERS_FILE = path.join(__dirname, 'users.json');

// Serve static files (HTML, CSS, JS)
app.use(express.static(__dirname));

// Endpoint for login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  fs.readFile(USERS_FILE, (err, data) => {
    if (err) {
      return res.status(500).send('Error reading user file.');
    }

    const users = JSON.parse(data);
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      return res.status(200).send('Login successful.');
    } else {
      return res.status(401).send('Invalid credentials.');
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
