const mysql = require('mysql');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);
  }
  console.log('🚀 MySQL connected');
});

async function registerUser(username, password) {
  // Vérification du nom d'utilisateur
  const query = 'SELECT * FROM users WHERE username = ?';
  connection.query(query, [username], (err, results) => {
    if (err) {
      console.error('Error checking existing user:', err);
      return;
    }

    if (results.length > 0) {
      console.error(`User with username "${username}" already exists`);
      return;
    }

    // Enregistrement des données dans la base de données
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
      if (err) {
        console.error('Error hashing password:', err);
        return;
      }

      const insertQuery = 'INSERT INTO users (username, password) VALUES (?, ?)';
      connection.query(insertQuery, [username, hashedPassword], (err) => {
        if (err) {
          console.error('Error registering user:', err);
          return;
        }
        console.log('User registered successfully');
      });
    });
  });
}

const [, , username, password] = process.argv;
registerUser(username, password);
