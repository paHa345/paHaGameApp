import { NextRequest, NextResponse } from "next/server";
import { WebSocketServer } from "ws";

export default function handler(req: any, res: any) {
  if (res.socket.server.ws) return;

  const ws = new WebSocketServer({ server: res.socket.server });
  res.socket.server.ws = ws;

  ws.on("connection", (socket) => {
    console.log("Connect");
    socket.on("message", (message) => {
      // Handle incoming messages
    });
  });

  res.end();
}
