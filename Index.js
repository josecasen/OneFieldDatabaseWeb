import express from 'express';
import mysql from 'mysql2';
import bodyParser from 'body-parser';

import { validateCreateUserParams } from './validator.js';

const app = express();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(bodyParser.json());
// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'development1'
});
// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as ID ' + db.threadId);
});
// Routes
app.get('/api/users', (req, res) => {
  db.query('SELECT * FROM personas', (err, results) => {
    if (err) {
      console.error('Error executing query: ' + err.stack);
      res.status(500).send('Error fetching users');
      return;
    }
    console.log('Results => ', { results })
    res.json(results);
  });
});


app.post('/api/users', (req, res) => {
    try {
        const validParams = validateCreateUserParams(req.body)

        const databaseQuery = `INSERT INTO personas (FirstName, LastName, Age) VALUES ("${validParams.FirstName}", "${validParams.LastName}", ${validParams.Age})`
    
        db.query(databaseQuery, (err, results) => {
            if (err) {
            console.error('Error executing query: ' + err.stack);
            res.status(500).send('Error creating user');
            return;
            }
            console.log('Results => ', { results })
            res.json(results);
        })
    } catch (error) {
        return res.status(401).send(error)
    }
})



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});