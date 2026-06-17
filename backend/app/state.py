import asyncio
import uuid
from typing import Any

from fastapi import WebSocket

from app.schemas.state import (
    Champion,
    MatchSnapshot,
    PlayerState,
    PopupCard,
)

DEFAULT_MAX_HEALTH = 30
MAX_WINS = 2
DEFAULT_CARD_DISPLAY_SECONDS = 8.0
PLAYER_IDS = ("1", "2")


def _max_health(player: PlayerState) -> int:
    if player.champion and player.champion.life:
        return player.champion.life
    return DEFAULT_MAX_HEALTH


class MatchStore:
    """Holds the single global match state and the set of connected clients."""

    def __init__(self) -> None:
        self._lock = asyncio.Lock()
        self._connections: set[WebSocket] = set()
        self._popup_task: asyncio.Task[None] | None = None
        self.players: dict[str, PlayerState] = {
            "1": PlayerState(name="Player 1"),
            "2": PlayerState(name="Player 2"),
        }
        self.card_display_seconds: float = DEFAULT_CARD_DISPLAY_SECONDS
        self.popup_card: PopupCard | None = None

    def snapshot(self) -> MatchSnapshot:
        return MatchSnapshot(
            players={pid: player.model_copy() for pid, player in self.players.items()},
            card_display_seconds=self.card_display_seconds,
            popup_card=self.popup_card.model_copy() if self.popup_card else None,
        )

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        async with self._lock:
            self._connections.add(websocket)
        await self._send(websocket, self.snapshot())

    async def disconnect(self, websocket: WebSocket) -> None:
        async with self._lock:
            self._connections.discard(websocket)

    async def _send(self, websocket: WebSocket, snapshot: MatchSnapshot) -> None:
        await websocket.send_json({"type": "state", "state": snapshot.model_dump()})

    async def broadcast(self) -> None:
        snapshot = self.snapshot()
        payload = {"type": "state", "state": snapshot.model_dump()}
        async with self._lock:
            targets = list(self._connections)
        stale: list[WebSocket] = []
        for connection in targets:
            try:
                await connection.send_json(payload)
            except Exception:
                stale.append(connection)
        if stale:
            async with self._lock:
                for connection in stale:
                    self._connections.discard(connection)

    def _player(self, player_id: Any) -> PlayerState | None:
        return self.players.get(str(player_id))

    async def handle_action(self, action: str, payload: dict[str, Any]) -> None:
        handler = getattr(self, f"_action_{action}", None)
        if handler is None:
            return
        handler(payload)
        if action == "show_card":
            self._schedule_popup_clear()
        await self.broadcast()

    def _action_set_name(self, payload: dict[str, Any]) -> None:
        player = self._player(payload.get("player"))
        if player is None:
            return
        name = str(payload.get("name", "")).strip()
        if name:
            player.name = name

    def _action_add_win(self, payload: dict[str, Any]) -> None:
        player = self._player(payload.get("player"))
        if player is None:
            return
        player.wins = min(MAX_WINS, player.wins + 1)

    def _action_remove_win(self, payload: dict[str, Any]) -> None:
        player = self._player(payload.get("player"))
        if player is None:
            return
        player.wins = max(0, player.wins - 1)

    def _action_add_damage(self, payload: dict[str, Any]) -> None:
        player = self._player(payload.get("player"))
        if player is None:
            return
        # Damage is intentionally uncapped: life can go to/below 0.
        player.damage = player.damage + 1

    def _action_remove_damage(self, payload: dict[str, Any]) -> None:
        player = self._player(payload.get("player"))
        if player is None:
            return
        # Allow negative damage so life can exceed the champion's printed
        # total (certain champions can gain life above their starting value).
        player.damage = player.damage - 1

    def _action_set_damage(self, payload: dict[str, Any]) -> None:
        player = self._player(payload.get("player"))
        if player is None:
            return
        try:
            value = int(payload.get("damage", player.damage))
        except (TypeError, ValueError):
            return
        player.damage = value

    def _action_set_champion(self, payload: dict[str, Any]) -> None:
        player = self._player(payload.get("player"))
        if player is None:
            return
        champion = payload.get("champion")
        if champion is None:
            player.champion = None
        else:
            player.champion = Champion.model_validate(champion)
        # Damage counters persist across champion changes.

    def _action_clear_champion(self, payload: dict[str, Any]) -> None:
        player = self._player(payload.get("player"))
        if player is None:
            return
        player.champion = None
        player.damage = 0

    def _action_set_card_duration(self, payload: dict[str, Any]) -> None:
        try:
            seconds = float(payload.get("seconds", self.card_display_seconds))
        except (TypeError, ValueError):
            return
        self.card_display_seconds = max(0.5, seconds)

    def _action_show_card(self, payload: dict[str, Any]) -> None:
        card = payload.get("card")
        if not card:
            self.popup_card = None
            return
        self.popup_card = PopupCard(
            name=str(card.get("name", "")),
            image=card.get("image"),
            token=uuid.uuid4().hex,
        )

    def _action_clear_card(self, payload: dict[str, Any]) -> None:
        self.popup_card = None

    def _action_next_game(self, payload: dict[str, Any]) -> None:
        # Keep names and wins; reset life counter, clear champions and any popup.
        for player in self.players.values():
            player.damage = 0
            player.champion = None
        self.popup_card = None

    def _action_reset_all(self, payload: dict[str, Any]) -> None:
        # Hard reset: restore the entire match to its initial state.
        self.players = {
            "1": PlayerState(name="Player 1"),
            "2": PlayerState(name="Player 2"),
        }
        self.card_display_seconds = DEFAULT_CARD_DISPLAY_SECONDS
        self.popup_card = None

    def _schedule_popup_clear(self) -> None:
        if self._popup_task and not self._popup_task.done():
            self._popup_task.cancel()
        if self.popup_card is None:
            return
        token = self.popup_card.token
        self._popup_task = asyncio.create_task(self._clear_popup_after(token))

    async def _clear_popup_after(self, token: str) -> None:
        try:
            await asyncio.sleep(self.card_display_seconds)
        except asyncio.CancelledError:
            return
        if self.popup_card and self.popup_card.token == token:
            self.popup_card = None
            await self.broadcast()


store = MatchStore()
