# Deployment Guide

## Local Docker

```bash
docker compose up --build
```

Frontend:

- `http://localhost:5173`

Backend:

- `http://localhost:8000`
- Swagger: `http://localhost:8000/docs`

## Railway

1. Create two services: one for `frontend`, one for `backend`.
2. Set the backend start command to `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
3. Set the frontend build command to `npm install && npm run build`.
4. Publish the frontend `dist` directory.
5. Add the environment variables from `.env.example`.

## Render

1. Create a Web Service for `backend`.
2. Create a Static Site for `frontend`.
3. Point the frontend API base URL to the backend public URL.

## AWS EC2

1. Launch Ubuntu EC2 with ports `80`, `443`, `5173`, and `8000` managed through Nginx or ALB.
2. Install Docker and Docker Compose.
3. Clone the repository and add the `.env` file.
4. Run `docker compose up -d --build`.
5. Configure HTTPS with Nginx and Certbot or use an AWS load balancer.

