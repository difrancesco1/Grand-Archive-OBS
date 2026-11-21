from typing import Literal

from pydantic import BaseModel

Spirit = Literal["fire", "water", "wind"]


class Champion(BaseModel):
    name: str
    slug: str
    image: str | None = None
    life: int | None = None


class PopupCard(BaseModel):
    name: str
    image: str | None = None
    token: str


class PlayerProfile(BaseModel):
    omni_id: int
    username: str
    avatar_image: str | None = None
    avatar_frame: str | None = None
    country: str | None = None


class PlayerState(BaseModel):
    name: str
    wins: int = 0
    damage: int = 0
    champion: Champion | None = None
    profile: PlayerProfile | None = None
    spirit: Spirit | None = None


class MatchSnapshot(BaseModel):
    players: dict[str, PlayerState]
    card_display_seconds: float
    popup_card: PopupCard | None = None
