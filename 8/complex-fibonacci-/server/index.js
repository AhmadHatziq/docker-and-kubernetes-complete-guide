const keys = require('./keys'); 

// Express App Setup 
const express = require('express'); 
const bodyParser = require('body-parser'); 
const cors = require('cors'); 

// Create an Express application
const app = express(); 
app.use(cors()); // CORS: Cross Origin Resource Sharing. Used to make a request from one domain to another. 
app.use(bodyParser.json()); // Will parse incoming request from the Reqyest app to a JSON 

// Setup to create and connect to POSTGRES server 
// Postgres Client Setup 
const { Pool } = require('pg'); 
const pgClient = new Pool({
    user: keys.pgUser, 
    host: keys.pgHost, 
    database: keys.pgDatabase, 
    password: keys.pgPassword, 
    port: keys.pgPort
}); 


// Postgres only stores the values that have been queries 
// Need to create a table on the first connection 
pgClient.on("connect", (client) => {
    client
      .query("CREATE TABLE IF NOT EXISTS values (number INT)")
      .catch((err) => console.error(err));
   });
   
pgClient.on('error', () => console.log('Lost PG connection'));

// Redis Client Setup 
const redis = require('redis'); 
const redisClient = redis.createClient({
    host: keys.redisHost, 
    port: keys.redisPort, 
    retry_strategy: () => 1000
}); 
const redisPublisher = redisClient.duplicate(); // From the docs, we need to use a duplicate to listen for connections etc. 

// Express route handlers -------------------------------------------------------------------------------------------------------

app.get('/', (req, res) => {
    res.send('Hi'); 
}); 

// Returns all the index values stored in the Postgres DB
app.get('/values/all', async (req, res) => {

    // Query the values table. 
    const values = await pgClient.query('SELECT * FROM values'); 

    // Send back the rows of the table queried. 
    res.send(values.rows); 
});  

// Query the redis data 
// Need to use callback function as the Redis does not support the async syntax (used in the Postgres DB)
app.get('/values/current', async (req, res) => {
    // console.log("Values current route triggered"); 
    redisClient.hgetall("values", (err, values) => {
        // console.log(values); 
        res.send(values); 
    });
}); 

// Handles the route where the user submits a value by POST 
app.post('/values', async (req, res) => {
    const index = req.body.index; 

    // Ensure that the index value is less than 40. 
    // Recursive method is very slow (for the worker method). 
    if (parseInt(index) > 40) {
        return res.status(422).send('Index is too high'); 
    }; 

    // The worker will calculate the value and store it, not the server 
    redisClient.hset('values', index, 'Nothing yet!'); 

    // Publish a new 'insert' event, which wakes up the Worker process
    redisPublisher.publish('insert', index); 

    // Add in the index value to the Postgress server, via the pgClient 
    pgClient.query('INSERT INTO values(number) VALUES($1)', [index]); 

    // Return the response back to the client 
    res.send({working:true}); 

}); 

// This server will listen on port 5000. 
app.listen(5000, err => {
    console.log('Listening'); 
}); 
