In this project, 2 containers are created. 

1. NodeJS app with a counter
2. Redis data store with the counter variable

This project illustrates how Docker Compose will automatically create a network and route traffic between 2 sub-containers. 
In this case, the redis service is tagged as 'redis-server' in the yml file. 
In index.js, the reference host connects to the redis as follows: 
`const client = redis.createClient({
    host: 'redis-server',      // Node JS or Reddis has no idea what this means
    port: 6379 
}); `
