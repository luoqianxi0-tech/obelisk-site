#!/usr/bin/env python3
import asyncio
import json
import websockets
import random
from datetime import datetime

clients = {}
traffic_buffer = []
hook_buffer = []
agent_status = {
    "running": True, 
    "platform": "windows", 
    "packets": 0, 
    "hooks": 0,
    "traffic_mbps": 0,
    "cpu_percent": 0,
    "memory_percent": 0,
    "risk": 0,
    "scans": 0,
    "nodes": 0
}

async def send_periodic_stats():
    """Send periodic stats updates to all connected clients"""
    global agent_status
    while True:
        # Simulate real-time security data
        agent_status["traffic_mbps"] = round(random.uniform(0.5, 8.5), 2)
        agent_status["cpu_percent"] = min(100, max(0, agent_status["cpu_percent"] + random.uniform(-5, 8)))
        agent_status["memory_percent"] = min(100, max(30, agent_status["memory_percent"] + random.uniform(-2, 3)))
        agent_status["packets"] += random.randint(10, 150)
        agent_status["hooks"] += random.randint(0, 5)
        agent_status["risk"] = min(100, max(0, agent_status["risk"] + random.uniform(-3, 5)))
        agent_status["nodes"] = random.randint(1, 8)
        
        stats_msg = json.dumps({
            "type": "stats",
            "data": {
                "traffic_mbps": agent_status["traffic_mbps"],
                "cpu_percent": round(agent_status["cpu_percent"], 1),
                "memory_percent": round(agent_status["memory_percent"], 1),
                "packets": agent_status["packets"],
                "hooks": agent_status["hooks"],
                "risk": round(agent_status["risk"], 1),
                "scans": agent_status["scans"],
                "nodes": agent_status["nodes"]
            }
        })
        
        # Send to all connected clients
        disconnected = []
        for client_id, client in clients.items():
            try:
                await client["ws"].send(stats_msg)
            except:
                disconnected.append(client_id)
        
        for client_id in disconnected:
            del clients[client_id]
        
        await asyncio.sleep(1)

async def ws_handler(websocket):
    client_id = id(websocket)
    clients[client_id] = {"ws": websocket, "userUid": None, "auth": False}
    print(f"[WS] Client connected: {client_id}")
    try:
        async for message in websocket:
            try:
                data = json.loads(message)
                action = data.get("action")
                if action == "auth":
                    clients[client_id]["userUid"] = data.get("uid")
                    clients[client_id]["auth"] = True
                    await websocket.send(json.dumps({"type": "auth_ok", "platform": agent_status["platform"]}))
                    print(f"[WS] Auth: {data.get('uid')}")
                elif action == "ping":
                    await websocket.send(json.dumps({"type": "pong"}))
                elif action == "get_traffic":
                    await websocket.send(json.dumps({"type": "traffic", "data": traffic_buffer[-50:]}))
                elif action == "get_hooks":
                    await websocket.send(json.dumps({"type": "hooks", "data": hook_buffer[-50:]}))
                elif action == "get_stats":
                    await websocket.send(json.dumps({
                        "type": "stats",
                        "data": {
                            "traffic_mbps": agent_status["traffic_mbps"],
                            "cpu_percent": round(agent_status["cpu_percent"], 1),
                            "memory_percent": round(agent_status["memory_percent"], 1),
                            "packets": agent_status["packets"],
                            "hooks": agent_status["hooks"],
                            "risk": round(agent_status["risk"], 1),
                            "scans": agent_status["scans"],
                            "nodes": agent_status["nodes"]
                        }
                    }))
            except Exception as e:
                print(f"[WS] Error processing message: {e}")
    except websockets.exceptions.ConnectionClosed:
        print(f"[WS] Client disconnected: {client_id}")
    finally:
        if client_id in clients:
            del clients[client_id]

async def main():
    print("=" * 50)
    print("  OBELISK Agent Server v1.0")
    print("  Platform: windows")
    print("=" * 50)
    
    # Start periodic stats task
    asyncio.create_task(send_periodic_stats())
    
    async with websockets.serve(ws_handler, "0.0.0.0", 8765):
        print("[WS] Server running on ws://0.0.0.0:8765")
        print("[INFO] Stats updates will be sent every 1 second")
        await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(main())