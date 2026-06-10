from typing import Any

from fastapi import APIRouter, Query

from app.clients import gatcg
from app.config import get_settings
from app.schemas.champion import ChampionDetail, ChampionSearchResult

router = APIRouter(prefix="/api/champions", tags=["champions"])

CHAMPION_TYPE = "CHAMPION"


def _image_url(path: str | None) -> str | None:
    if not path:
        return None
    if path.startswith("http://") or path.startswith("https://"):
        return path
    base = get_settings().ga_image_base.rstrip("/")
    return f"{base}/{path.lstrip('/')}"


def _is_champion(card: dict[str, Any]) -> bool:
    types = card.get("types") or []
    return CHAMPION_TYPE in types


def _search_image(card: dict[str, Any]) -> str | None:
    editions = card.get("editions") or []
    if not editions:
        return None
    uuid = editions[0].get("uuid")
    if not uuid:
        return None
    return _image_url(f"/cards/images/{uuid}.jpg")


@router.get("/search", response_model=list[ChampionSearchResult])
async def search_champions(
    q: str = Query(..., min_length=1, description="Champion name to search for"),
    limit: int = Query(10, ge=1, le=10),
) -> list[ChampionSearchResult]:
    cards = await gatcg.autocomplete(q)
    results = [
        ChampionSearchResult(
            name=card.get("name", ""),
            slug=card.get("slug", ""),
            image=_search_image(card),
        )
        for card in cards
        if _is_champion(card) and card.get("slug")
    ]
    return results[:limit]


@router.get("/{slug}", response_model=ChampionDetail)
async def get_champion(slug: str) -> ChampionDetail:
    card = await gatcg.get_card(slug)

    editions = card.get("result_editions") or card.get("editions") or []
    image_path = editions[0].get("image") if editions else None

    return ChampionDetail(
        name=card.get("name", ""),
        slug=card.get("slug", slug),
        life=card.get("life"),
        image=_image_url(image_path),
        classes=card.get("classes") or [],
        types=card.get("types") or [],
        element=card.get("element"),
    )
