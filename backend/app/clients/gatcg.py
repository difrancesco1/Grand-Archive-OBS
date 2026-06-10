from typing import Any

import httpx

from app.config import get_settings

_client: httpx.AsyncClient | None = None


def _build_client() -> httpx.AsyncClient:
    settings = get_settings()
    return httpx.AsyncClient(
        base_url=settings.ga_api_base,
        timeout=settings.request_timeout_seconds,
        headers={"Accept": "application/json"},
    )


async def startup() -> None:
    global _client
    if _client is None:
        _client = _build_client()


async def shutdown() -> None:
    global _client
    if _client is not None:
        await _client.aclose()
        _client = None


def _get_client() -> httpx.AsyncClient:
    if _client is None:
        raise RuntimeError("Grand Archive client not initialized")
    return _client


async def autocomplete(name: str) -> list[dict[str, Any]]:
    """Quick card search. Returns up to 10 cards matching the given name."""
    response = await _get_client().get("/cards/autocomplete", params={"name": name})
    response.raise_for_status()
    return response.json()


async def get_card(slug: str) -> dict[str, Any]:
    """Fetch a single card by its slug."""
    response = await _get_client().get(f"/cards/{slug}")
    response.raise_for_status()
    return response.json()
