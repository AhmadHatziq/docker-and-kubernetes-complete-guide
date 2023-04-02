# This Dockerfile is only for the NodeApp, not the Redis server 

FROM node:alpine 

WORKDIR '/app'

# Install the dependencies
COPY package.json . 
RUN npm install 

# Copy the other source files
COPY . . 


CMD ["npm", "start"]

