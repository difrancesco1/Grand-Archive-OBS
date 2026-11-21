"""Client for the unofficial Grand Archive Omnidex and accounts endpoints.

The Omnidex API is undocumented, beta, and officially unsupported, so this
client behaves like a polite citizen: it spaces out upstream requests, retries
transient gateway errors with backoff, and aggressively caches responses so we
don't re-hit the API for data we already have.
"""

import asyncio
import time
from typing import Any

import httpx

from app.config import get_settings

# How long cached responses stay fresh.
_EVENT_TTL_SECONDS = 300.0
_AVATAR_TTL_SECONDS = 3600.0

# Minimum spacing between upstream requests (per host group).
_REQUEST_SPACING_SECONDS = 0.5

# Transient upstream statuses worth retrying.
_RETRY_STATUSES = {502, 503, 504}
_MAX_RETRIES = 3

_omni_client: httpx.AsyncClient | None = None
_accounts_client: httpx.AsyncClient | None = None

_event_cache: dict[str, tuple[float, list[dict[str, Any]]]] = {}
_avatar_cache: dict[int, tuple[float, dict[str, Any]]] = {}

_request_lock = asyncio.Lock()
_last_request_at = 0.0


def _build_client(base_url: str) -> httpx.AsyncClient:
    settings = get_settings()
    return httpx.AsyncClient(
        base_url=base_url,
        timeout=settings.request_timeout_seconds,
        headers={"Accept": "application/json"},
    )


async def startup() -> None:
    global _omni_client, _accounts_client
    settings = get_settings()
    if _omni_client is None:
        _omni_client = _build_client(settings.ga_omni_base)
    if _accounts_client is None:
        _accounts_client = _build_client(settings.ga_accounts_base)


async def shutdown() -> None:
    global _omni_client, _accounts_client
    if _omni_client is not None:
        await _omni_client.aclose()
        _omni_client = None
    if _accounts_client is not None:
        await _accounts_client.aclose()
        _accounts_client = None
    _event_cache.clear()
    _avatar_cache.clear()


def _require(client: httpx.AsyncClient | None) -> httpx.AsyncClient:
    if client is None:
        raise RuntimeError("Omnidex client not initialized")
    return client


async def _throttle() -> None:
    """Ensure at least _REQUEST_SPACING_SECONDS between upstream requests."""
    global _last_request_at
    async with _request_lock:
        now = time.monotonic()
        wait = _REQUEST_SPACING_SECONDS - (now - _last_request_at)
        if wait > 0:
            await asyncio.sleep(wait)
        _last_request_at = time.monotonic()


async def _get_json(
    client: httpx.AsyncClient, path: str, params: dict[str, Any] | None = None
) -> Any:
    last_exc: Exception | None = None
    for attempt in range(_MAX_RETRIES):
        await _throttle()
        try:
            response = await client.get(path, params=params)
        except httpx.TransportError as exc:
            last_exc = exc
            await asyncio.sleep(0.5 * (attempt + 1))
            continue
        if response.status_code in _RETRY_STATUSES and attempt < _MAX_RETRIES - 1:
            await asyncio.sleep(0.5 * (attempt + 1))
            continue
        response.raise_for_status()
        return response.json()
    if last_exc is not None:
        raise last_exc
    # Exhausted retries on a retryable status: surface the final response error.
    response.raise_for_status()
    return response.json()


async def get_event_players(event_id: str) -> list[dict[str, Any]]:
    """Return the players participating in the given Omnidex event (cached)."""
    cached = _event_cache.get(event_id)
    if cached is not None and (time.monotonic() - cached[0]) < _EVENT_TTL_SECONDS:
        return cached[1]

    data = await _get_json(
        _require(_omni_client), "/api/v2/events/users", params={"id": event_id}
    )
    players = data if isinstance(data, list) else []
    _event_cache[event_id] = (time.monotonic(), players)
    return players


async def get_avatar(user_id: int) -> dict[str, Any]:
    """Return the avatar payload ({image, frame, rarity}) for a user (cached)."""
    cached = _avatar_cache.get(user_id)
    if cached is not None and (time.monotonic() - cached[0]) < _AVATAR_TTL_SECONDS:
        return cached[1]

    data = await _get_json(
        _require(_accounts_client), "/user/avatar", params={"userId": user_id}
    )
    if not isinstance(data, dict):
        data = {}
    _avatar_cache[user_id] = (time.monotonic(), data)
    return data
