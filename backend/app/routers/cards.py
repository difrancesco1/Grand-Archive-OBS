from typing import Any

from fastapi import APIRouter, Query

from app.clients import gatcg
from app.config import get_settings
from app.schemas.champion import CardSearchResult

router = APIRouter(prefix="/api/cards", tags=["cards"])


def _image_url(path: str | None) -> str | None:
    if not path:
        return None
    if path.startswith("http://") or path.startswith("https://"):
        return path
    base = get_settings().ga_image_base.rstrip("/")
    return f"{base}/{path.lstrip('/')}"


def _search_image(card: dict[str, Any]) -> str | None:
    editions = card.get("editions") or []
    if not editions:
        return None
    uuid = editions[0].get("uuid")
    if not uuid:
        return None
    return _image_url(f"/cards/images/{uuid}.jpg")


@router.get("/search", response_model=list[CardSearchResult])
async def search_cards(
    q: str = Query(..., min_length=1, description="Card name to search for"),
    limit: int = Query(10, ge=1, le=10),
) -> list[CardSearchResult]:
    cards = await gatcg.autocomplete(q)
    results = [
        CardSearchResult(
            name=card.get("name", ""),
            slug=card.get("slug", ""),
            image=_search_image(card),
        )
        for card in cards
        if card.get("slug")
    ]
    return results[:limit]
