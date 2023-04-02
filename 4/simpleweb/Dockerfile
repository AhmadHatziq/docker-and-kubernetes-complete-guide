# Specify base image 
FROM node:14-alpine

# Set working directory on the Linux container 
WORKDIR /usr/app 

# Copy package json to the current working directory 
COPY ./package.json ./

# Install dependencies 
RUN npm install 

# After installing the dependencies, copy everything else
COPY ./ ./ 

# Default command 
CMD ["npm", "start"]



