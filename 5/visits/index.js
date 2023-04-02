const express = require('express'); 
const redis = require('redis'); 
const process = require('process'); 

const app = express(); 
const client = redis.createClient({
    host: 'redis-server',      // Node JS or Reddis has no idea what this means
    port: 6379 
}); 

// Initialize the value to 0 
client.set('visits', 0); 

// When the client connects, the app will obtain the 'visits' value using the redis client 
// It will return the string "Number of vists: X" to the client 
// It will increment the 'visits' value using the redis client 
app.get('/', (req, res) => {

    // Manually triggering a crash 
    process.exit(0); 

    client.get('visits', (err, visits) => {
        res.send('Number of visits is ' + visits); 
        client.set('visits', parseInt(visits) + 1)
    }); 
}); 

app.listen(8081, () => {
    console.log('Listening on port 8081 on the container.'); 
}); 