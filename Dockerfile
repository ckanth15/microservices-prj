# Dockerfile for the backend Node.js API
# Use an official Node.js image as the base image.
FROM node:18-alpine

# Set the working directory inside the container.
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory.
# This is a common practice to leverage Docker's caching.
COPY package*.json ./

# Install the project dependencies.
RUN npm install

# Copy the rest of the application source code.
COPY . .

# Expose port 3000 to the outside world.
EXPOSE 3000

# Define the command to run the application when the container starts.
CMD ["npm", "start"]

