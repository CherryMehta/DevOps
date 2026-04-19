# Real Estate AI Demo

This repository contains a full-stack real estate assistant demo:

- `real_estate_ai/`: FastAPI + MongoDB + Gemini backend
- `real-estate-ai-frontend/`: React + Vite frontend

## Project Structure

```text
real_estate_ai/            FastAPI backend
real-estate-ai-frontend/   React frontend
```

## Quick Start

### 1. Backend

```bash
cd real_estate_ai
cp .env.example .env
pip install -r requirements.txt
uvicorn app:app --host 127.0.0.1 --port 8000
```

### 2. Frontend

```bash
cd real-estate-ai-frontend
npm install
cp .env.example .env
npm run dev -- --host 127.0.0.1 --port 5173
```

### 3. Open the app

Go to:

```text
http://127.0.0.1:5173/
```

## Environment

Backend `.env` values:

```env
APP_NAME=Real Estate AI Support Triage Agent
ENV=development
MONGO_URI=mongodb://localhost:27017
DB_NAME=real_estate_db
GEMINI_API_KEY=your_gemini_api_key_here
```

Frontend `.env` values:

```env
VITE_API_URL=http://localhost:8000
```

## Before Pushing to GitHub

- Keep `.env` files private
- Make sure MongoDB is not committed
- Do not commit `.venv`, `node_modules`, or `dist`
- If any API key was previously exposed, rotate it before publishing
