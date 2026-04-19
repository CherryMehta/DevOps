# Real Estate AI Backend

FastAPI backend for the Real Estate AI demo app. It serves:

- `POST /chat` for AI-assisted property recommendations
- `GET /properties/buy` for filtered buy listings
- `GET /properties/rent` for filtered rent listings
- `GET /health` for a simple health check

## Setup

1. Create and activate a virtual environment.
2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Copy the environment file:

```bash
cp .env.example .env
```

4. Update `.env` with:

- `MONGO_URI`
- `DB_NAME`
- `GEMINI_API_KEY`

## Run

```bash
uvicorn app:app --host 127.0.0.1 --port 8000
```

## Notes

- MongoDB must be running locally or reachable via `MONGO_URI`.
- The frontend dev server is expected on `http://127.0.0.1:5173` or `http://localhost:5173`.
- Property data is read from the `properties` collection.
