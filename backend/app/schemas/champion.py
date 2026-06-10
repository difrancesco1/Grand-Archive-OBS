from pydantic import BaseModel


class ChampionSearchResult(BaseModel):
    name: str
    slug: str
    image: str | None = None


class CardSearchResult(BaseModel):
    name: str
    slug: str
    image: str | None = None


class ChampionDetail(BaseModel):
    name: str
    slug: str
    life: int | None = None
    image: str | None = None
    classes: list[str] = []
    types: list[str] = []
    element: str | None = None
