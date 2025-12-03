# Docker (Production) — Backend

This file describes building and running the backend in Docker using the bundled `puppeteer` Chromium (Option A).

Build image
```bash
docker build -t resume-backend:latest -f backend/Dockerfile backend
```

Run container (recommended with increased shared memory)
```bash
docker run -p 5000:5000 --shm-size=1g \
  -e NODE_ENV=production \
  -e PORT=5000 \
  -e MONGODB_URI="your_mongo_uri" \
  -e JWT_SECRET="your_jwt_secret" \
  -e CLOUDINARY_CLOUD_NAME=... \
  -e CLOUDINARY_API_KEY=... \
  -e CLOUDINARY_API_SECRET=... \
  resume-backend:latest
```

Or use docker-compose (set env vars in your environment or a .env file):
```bash
docker compose up --build
```

Notes
- The Docker image installs system libraries required by Chromium. Puppeteer will download a compatible Chromium binary during `npm ci`.
- Use `--shm-size=1g` (or larger) to avoid shared memory issues during PDF generation.
- For smaller images, consider switching to `puppeteer-core` and installing system Chromium explicitly.
