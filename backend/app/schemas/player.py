from pydantic import BaseModel


class PlayerSearchResult(BaseModel):
    id: int
    username: str
    country: str | None = None


class PlayerAvatar(BaseModel):
    image: str | None = None
    frame: str | None = None
    rarity: int | None = None
