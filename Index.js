import express from 'express';
import mysql from 'mysql2';
import bodyParser from 'body-parser';

import { validateCreateUserParams } from './validator.js';
import { validateUpdateContactParams} from './validator.js';

const app = express();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(bodyParser.json());
// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
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

app.get('/', (req, res) => {
    res.status(200).send('Server Working')
})

// Routes
app.get('/api/users', (req, res) => {
  db.query('SELECT * FROM persons', (err, results) => {
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

        const databaseQuery = `INSERT INTO persons (FirstName, LastName, Age) VALUES ("${validParams.FirstName}", "${validParams.LastName}", ${validParams.Age})`
    
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

//Update PersonsContactDatas
app.put('/api/users/:id', (req, res) => {

    const delid=req.params.id; 


    try {
        const validParams = validateUpdateContactParams(req.body)

        const databaseQuery = `Update persons set FirstName = "${validParams.FirstName}",LastName= "${validParams.LastName}", Age= "${validParams.Age}" where id=?,delid`
    
        db.query(databaseQuery, (err, results) => {
            if (err) {
            console.error('Error executing query: ' + err.stack);
            res.status(500).send('Error updating contact datas');
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