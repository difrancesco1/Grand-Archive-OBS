from typing import Any

import httpx
from fastapi import APIRouter, HTTPException, Query

from app.clients import omnidex
from app.config import get_settings
from app.schemas.player import PlayerAvatar, PlayerSearchResult

router = APIRouter(prefix="/api/players", tags=["players"])


def _avatar_url(path: str | None) -> str | None:
    if not path:
        return None
    if path.startswith("http://") or path.startswith("https://"):
        return path
    base = get_settings().ga_accounts_base.rstrip("/")
    return f"{base}/{path.lstrip('/')}"


def _matches(player: dict[str, Any], q: str) -> bool:
    username = str(player.get("username") or "")
    if q.lower() in username.lower():
        return True
    return str(player.get("id")) == q


@router.get("/search", response_model=list[PlayerSearchResult])
async def search_players(
    event_id: str = Query(..., description="Omnidex event ID to search within"),
    q: str = Query(..., min_length=1, description="Username or Omni number"),
    limit: int = Query(10, ge=1, le=10),
) -> list[PlayerSearchResult]:
    try:
        players = await omnidex.get_event_players(event_id)
    except httpx.HTTPStatusError as exc:
        raise HTTPException(
            status_code=exc.response.status_code,
            detail=f"Could not load Omnidex event '{event_id}'",
        ) from exc
    except httpx.HTTPError as exc:
        raise HTTPException(
            status_code=502, detail="Omnidex upstream request failed"
        ) from exc

    query = q.strip()
    results = [
        PlayerSearchResult(
            id=int(player["id"]),
            username=str(player.get("username") or ""),
            country=player.get("countryCode"),
        )
        for player in players
        if player.get("id") is not None and _matches(player, query)
    ]
    return results[:limit]


@router.get("/{player_id}/avatar", response_model=PlayerAvatar)
async def get_player_avatar(player_id: int) -> PlayerAvatar:
    try:
        avatar = await omnidex.get_avatar(player_id)
    except httpx.HTTPStatusError as exc:
        raise HTTPException(
            status_code=exc.response.status_code,
            detail=f"Could not load avatar for player '{player_id}'",
        ) from exc
    except httpx.HTTPError as exc:
        raise HTTPException(
            status_code=502, detail="Accounts upstream request failed"
        ) from exc

    return PlayerAvatar(
        image=_avatar_url(avatar.get("image")),
        frame=_avatar_url(avatar.get("frame")),
        rarity=avatar.get("rarity"),
    )
