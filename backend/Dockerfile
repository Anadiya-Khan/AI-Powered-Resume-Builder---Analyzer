FROM node:20-bullseye-slim

# Install system dependencies required by headless Chromium
RUN apt-get update && apt-get install -y \
  ca-certificates \
  fonts-liberation \
  libnss3 \
  libatk-bridge2.0-0 \
  libgtk-3-0 \
  libxss1 \
  libasound2 \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  libgbm1 \
  libcups2 \
  libxkbcommon0 \
  libpangocairo-1.0-0 \
  wget \
  --no-install-recommends && rm -rf /var/lib/apt/lists/*;

# Create app directory
WORKDIR /usr/src/app

# Copy only package.json & package-lock for npm ci caching
COPY package*.json ./

# Install dependencies (this will download Chromium because puppeteer is a dependency)
RUN npm ci --production

# Copy app sources
COPY . .

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

# Use a larger shared memory when running (use --shm-size=1g at run time)
CMD ["node", "server.js"]
