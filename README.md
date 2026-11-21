# 🪐 Orbit: a Dockerized Python website

An animated solar-system landing page served by **Flask + gunicorn**, packaged in a
small, non-root, multi-stage Docker image with a built-in health check.

## Features
- Twinkling starfield with shooting stars (canvas) and a CSS-animated solar system
- `/api/fact`: random space fact
- `/api/info`: which container served you (hostname, uptime, Python version)
- `/healthz`: used by the Docker `HEALTHCHECK`
- Configurable through environment variables: `SITE_NAME`, `ACCENT_COLOR`, `APP_VERSION`, `PORT`

## Project layout
```
orbit/
├── app/
│   ├── __init__.py        # Flask app + routes
│   ├── templates/index.html
│   └── static/            # style.css, app.js
├── tests/test_app.py
├── requirements.txt
├── Dockerfile             # multi-stage, non-root, healthcheck
├── docker-compose.yml
└── .dockerignore
```

## Run with Docker
```bash
docker build -t orbit .
docker run -d -p 8000:8000 --name orbit orbit
# open http://localhost:8000
docker ps            # STATUS shows (healthy) after a few seconds
```

Customize it without rebuilding:
```bash
docker run -d -p 8080:8000 -e SITE_NAME="Nebula" -e ACCENT_COLOR="#ff7ad9" orbit
```

## Run with Docker Compose
```bash
docker compose up -d --build
docker compose logs -f
docker compose down
```

### Scaling demo
Remove the `ports:` mapping (or use a reverse proxy), then:
```bash
docker compose up -d --scale web=3
```
Each replica reports its own container ID on the "Mission control" card.

## Run locally without Docker
```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
flask --app app run --debug        # http://127.0.0.1:5000
pytest                             # needs: pip install pytest
```
