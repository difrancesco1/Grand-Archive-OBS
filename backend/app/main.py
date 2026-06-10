from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.clients import gatcg
from app.config import get_settings
from app.routers import cards, champions, state


@asynccontextmanager
async def lifespan(app: FastAPI):
    await gatcg.startup()
    try:
        yield
    finally:
        await gatcg.shutdown()


app = FastAPI(
    title="Grand Archive OBS Backend",
    description="Proxies the Grand Archive public API for the OBS player tracker.",
    version="0.1.0",
    lifespan=lifespan,
)

settings = get_settings()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(champions.router)
app.include_router(cards.router)
app.include_router(state.router)


@app.get("/health", tags=["health"])
async def health() -> dict[str, str]:
    return {"status": "ok"}
