from pydantic import BaseModel


class Champion(BaseModel):
    name: str
    slug: str
    image: str | None = None
    life: int | None = None


class PopupCard(BaseModel):
    name: str
    image: str | None = None
    token: str


class PlayerState(BaseModel):
    name: str
    wins: int = 0
    damage: int = 0
    champion: Champion | None = None


class MatchSnapshot(BaseModel):
    players: dict[str, PlayerState]
    card_display_seconds: float
    popup_card: PopupCard | None = None
