const keys = require('./keys'); 
const redis = require('redis'); 

const redisClient = redis.createClient({
    host: keys.redisHost, 
    port: keys.redisPort, 
    retry_strategy: () => 1000 // Reconnect every 1 second
}); 

// Subscription for Redis
const sub = redisClient.duplicate(); 

// Fibonacci recursive solution. 
// this is very slow. 
function fib(index) {
    if (index < 2) return 1; 
    return fib(index - 1) + fib(index - 2); 
}

// Everytime there is a new value that shows up in Redis, we will calculate a new Fibonacci value and 
// insert that into a hash called 'values', where the key is the index
// Message is the index value that the user inserts into the program. 
sub.on('message', (channel, message) => {
    redisClient.hset('values', message, fib(parseInt(message))); 
}); 

// Everytime some one inserts a value into Reddis, we will calculate the fib function. 
sub.subscribe('insert'); 

