from fastapi import FastAPI
from .database import engine, Base
from .routers import users, news, products
from fastapi.middleware.cors import CORSMiddleware

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Enterprise Portal API",
    description="API for Enterprise Portal Website",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(users.router)
app.include_router(news.router)
app.include_router(products.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Enterprise Portal API"}
