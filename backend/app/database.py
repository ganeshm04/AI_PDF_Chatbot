from prisma import Prisma
from supabase import create_client, Client
from contextlib import asynccontextmanager
from .config import SUPABASE_URL, SUPABASE_KEY, DATABASE_URL

# Initialize Prisma client
prisma = Prisma()
db = None  # Will be initialized during startup

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

async def initialize_db():
    """Initialize database connections"""
    global db
    await prisma.connect()
    db = prisma
    print("Database connections initialized successfully")

async def close_db():
    """Close database connections"""
    await prisma.disconnect()
    print("Database connections closed")

@asynccontextmanager
async def get_prisma():
    """Get Prisma connection context"""
    try:
        yield prisma
    finally:
        # Connection will be released back to the pool
        pass

def get_supabase() -> Client:
    """Get Supabase client instance"""
    return supabase

# Helper functions for common database operations
async def execute_query(table: str, query_type: str, use_supabase: bool = False, **kwargs):
    """
    Execute common database operations using either Prisma or Supabase
    
    Args:
        table (str): Table name
        query_type (str): Type of query (select, insert, update, delete)
        use_supabase (bool): Whether to use Supabase instead of Prisma
        **kwargs: Additional arguments for the query
    """
    if use_supabase:
        db = get_supabase()
        if query_type == "select":
            return db.table(table).select("*").execute()
        elif query_type == "insert":
            return db.table(table).insert(kwargs.get("data")).execute()
        elif query_type == "update":
            return db.table(table).update(kwargs.get("data")).eq("id", kwargs.get("id")).execute()
        elif query_type == "delete":
            return db.table(table).delete().eq("id", kwargs.get("id")).execute()
    else:
        # Use Prisma for database operations
        async with get_prisma() as db:
            if query_type == "select":
                return await getattr(db, table).find_many()
            elif query_type == "insert":
                return await getattr(db, table).create(data=kwargs.get("data"))
            elif query_type == "update":
                return await getattr(db, table).update(
                    where={"id": kwargs.get("id")},
                    data=kwargs.get("data")
                )
            elif query_type == "delete":
                return await getattr(db, table).delete(where={"id": kwargs.get("id")})
    
    raise ValueError(f"Invalid query type: {query_type}")