import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Base directory
BASE_DIR = Path(__file__).resolve().parent.parent

# App settings
APP_NAME = os.getenv("APP_NAME", "PDF QA Application")

# Supabase settings
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")

# Database settings for Prisma
DATABASE_URL = os.getenv("DATABASE_URL")  # This will be your Supabase PostgreSQL connection string

# OpenAI API key for LangChain
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# File upload settings
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "./uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)  # Ensure the upload directory exists

# Other settings
MAX_UPLOAD_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_EXTENSIONS = {"pdf"}