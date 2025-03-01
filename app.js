const express = require('express');
const mysql = require('mysql');
const crypto = require('crypto');

const app = express();
app.use(express.json());

// Niebezpieczne połączenie z bazą danych (hardcoded credentials)
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password123',
  database: 'testdb'
});

// Podatność na SQL Injection
app.get('/users', (req, res) => {
  const { id } = req.query;
  const query = `SELECT * FROM users WHERE id = ${id}`;
  connection.query(query, (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});
// Niebezpieczne hashowanie hasła
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = crypto.createHash('md5').update(password).digest('hex');
  // Zapisz hashedPassword do bazy danych
  res.send('User registered');
});

// Podatność XSS
app.get('/welcome', (req, res) => {
  const { name } = req.query;
  res.send(`<h1>Welcome, ${name}!</h1>`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
