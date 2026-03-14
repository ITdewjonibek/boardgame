from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, List, Any
import json

router = APIRouter(prefix="/ws", tags=["multiplayer"])

class ConnectionManager:
    def __init__(self):
        # Room ID -> List of WebSockets
        self.rooms: Dict[str, List[WebSocket]] = {}
        # Room ID -> List of player states
        self.game_states: Dict[str, Dict[str, Any]] = {}

    async def connect(self, websocket: WebSocket, room_id: str, player_id: str):
        await websocket.accept()
        if room_id not in self.rooms:
            self.rooms[room_id] = []
            self.game_states[room_id] = {"players": {}, "status": "waiting"}
        
        self.rooms[room_id].append(websocket)
        self.game_states[room_id]["players"][player_id] = {
            "score": 0,
            "progress": 0,
            "status": "active"
        }
        
        # Broadcast player joined
        await self.broadcast(room_id, {
            "type": "player_joined",
            "player_id": player_id,
            "total_players": len(self.rooms[room_id]),
            "state": self.game_states[room_id]
        })

    def disconnect(self, websocket: WebSocket, room_id: str, player_id: str):
        if room_id in self.rooms:
            self.rooms[room_id].remove(websocket)
            if player_id in self.game_states[room_id]["players"]:
                del self.game_states[room_id]["players"][player_id]
            
            if not self.rooms[room_id]:
                del self.rooms[room_id]
                del self.game_states[room_id]

    async def broadcast(self, room_id: str, message: dict):
        if room_id in self.rooms:
            for connection in self.rooms[room_id]:
                await connection.send_json(message)

    async def update_state(self, room_id: str, player_id: str, data: dict):
        if room_id in self.game_states:
            if player_id in self.game_states[room_id]["players"]:
                self.game_states[room_id]["players"][player_id].update(data)
                await self.broadcast(room_id, {
                    "type": "state_update",
                    "player_id": player_id,
                    "state": self.game_states[room_id]
                })

manager = ConnectionManager()

@router.websocket("/{room_id}/{player_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str, player_id: str):
    await manager.connect(websocket, room_id, player_id)
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message.get("type") == "score_update":
                await manager.update_state(room_id, player_id, {
                    "score": message.get("score"),
                    "progress": message.get("progress")
                })
            
            if message.get("type") == "attack":
                # Special multiplayer event: slow down others or add time to self
                await manager.broadcast(room_id, {
                    "type": "battle_event",
                    "from": player_id,
                    "event": message.get("event") # e.g., 'shield', 'freeze'
                })
                
    except WebSocketDisconnect:
        manager.disconnect(websocket, room_id, player_id)
        await manager.broadcast(room_id, {
            "type": "player_left",
            "player_id": player_id
        })
