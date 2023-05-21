# Use the official Node.js image as the base image
FROM node:lts-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm ci

# Copy the rest of the application code to the working directory
COPY . .

# Build the TypeScript project
RUN npm run build

# Expose the port your application will run on
EXPOSE 3000

# Start the application
CMD [ "npm", "start" ]

# build:
# docker build -t artic-api .
# run:
# docker run -p 3000:3000 --name artic-api-localhost-3000 your-image-name