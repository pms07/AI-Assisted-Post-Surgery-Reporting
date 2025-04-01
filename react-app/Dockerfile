# react-app/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Build the production files (this generates the 'dist' folder)
RUN npm run build

EXPOSE 9100

# Start Vite preview on port 9100
CMD ["npm", "start"]
