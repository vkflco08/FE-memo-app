# Use the official Node.js image as the base image
FROM node:14

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React application
RUN npm run build

# Install serve to serve the build directory
RUN npm install -g serve

# Expose the port the app runs on
EXPOSE 80

# Start the application
CMD ["serve", "-s", "build", "-l", "80"]