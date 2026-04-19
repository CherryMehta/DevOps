from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config.settings import settings
from api.routes import router

app = FastAPI(title=settings.APP_NAME)

@app.get("/")
def read_root():
    return {"message": "Backend is running 🚀"}
    

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5173",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/health")
def health():
    return {"status": "ok"}

from fastapi import BackgroundTasks
import subprocess

@app.get("/run-scraper")
def run_scraper(background_tasks: BackgroundTasks):

    def run():
        subprocess.run(["python", "scraper/bulk_rent_scraper.py"])
        subprocess.run(["python", "scraper/bulk_property_scraper.py"])

    background_tasks.add_task(run)

    return {"message": "Scraper started in background"}