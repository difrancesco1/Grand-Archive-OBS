from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.schemas.state import MatchSnapshot
from app.state import store

router = APIRouter(tags=["state"])


@router.get("/api/state", response_model=MatchSnapshot)
async def get_state() -> MatchSnapshot:
    return store.snapshot()


@router.websocket("/ws")
async def match_socket(websocket: WebSocket) -> None:
    await store.connect(websocket)
    try:
        while True:
            message = await websocket.receive_json()
            if message.get("type") != "action":
                continue
            action = message.get("action")
            if not isinstance(action, str):
                continue
            payload = message.get("payload") or {}
            if not isinstance(payload, dict):
                payload = {}
            await store.handle_action(action, payload)
    except WebSocketDisconnect:
        pass
    finally:
        await store.disconnect(websocket)
