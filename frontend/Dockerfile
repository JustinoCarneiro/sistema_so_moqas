FROM node:20-slim

WORKDIR /app

# Install dependencies first for better caching
COPY package.json package-lock.json* /app/
RUN npm install

# Copy project
COPY . /app/

# Expose port
EXPOSE 5173

# Default command for development
CMD ["npm", "run", "dev", "--", "--host"]
