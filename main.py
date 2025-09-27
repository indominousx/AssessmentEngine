# /assessment_engine/main.py

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Import the router from your backend package
from backend.router import router as assessment_router

# Load environment variables from .env file (for GEMINI_API_KEY)
load_dotenv()

# Create the FastAPI app instance
app = FastAPI(
    title="AI-Powered Behavioral Assessment Engine",
    description="An engine to provide culturally adapted psychological assessments for Indian youth.",
    version="1.0.0"
)

# --- Configure CORS (Cross-Origin Resource Sharing) ---
origins = [
    "http://localhost:5173",  # Default Vite dev server port
    "http://localhost:3000",  # Default Create React App port
    "http://localhost:3001",  # Alternative React App port
    # Add your deployed frontend URL here in production
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Include the API Router ---
app.include_router(assessment_router)

# --- Root Endpoint ---
@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Welcome to the Assessment Engine API"}

# --- Run the Server (for development) ---
if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8069, reload=True)