FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Copy app source
COPY . .

# Set production environment
ENV NODE_ENV="production"

# Expose the port your app runs on
EXPOSE 5000

# Start the app
CMD ["npm", "start"]