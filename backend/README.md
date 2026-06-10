# Grand Archive OBS Backend

FastAPI service that proxies the [Grand Archive public API](https://api-docs.gatcg.com/)
to power the OBS player tracker. The first feature lets a production member search for a
player's champion and retrieve its name, art, and total health (life).

## Requirements

- Python 3.11+

## Setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Optionally copy `.env.example` to `.env` to override defaults.

## Run

```bash
uvicorn app.main:app --reload
```

The API runs at `http://localhost:8000`. Interactive docs are at
`http://localhost:8000/docs`.

## Endpoints

| Method | Path                          | Description                                              |
| ------ | ----------------------------- | -------------------------------------------------------- |
| GET    | `/health`                     | Health check.                                            |
| GET    | `/api/champions/search?q=`    | Quick search, CHAMPION-type cards only (name, slug, image). |
| GET    | `/api/champions/{slug}`       | Champion detail: name, life (total health), image, etc.  |

### Examples

```bash
curl "http://localhost:8000/api/champions/search?q=diana"
curl "http://localhost:8000/api/champions/diana-aether-dilettante"
```
