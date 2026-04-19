# Real Estate AI Frontend

React + Vite frontend for the Real Estate AI demo app.

## Features

- Browse buy and rent listings with filters
- Chat with the AI property assistant
- Demo signup and login stored in browser local storage
- Save favorite properties locally

## Setup

```bash
npm install
cp .env.example .env
```

Set `VITE_API_URL` in `.env` if your backend is not running on `http://localhost:8000`.

## Run

```bash
npm run dev -- --host 127.0.0.1 --port 5173
```

## Build

```bash
npm run build
```

## Notes

- This demo currently uses local browser storage for auth and saved properties.
- The frontend expects the FastAPI backend routes:
  - `POST /chat`
  - `GET /properties/buy`
  - `GET /properties/rent`
