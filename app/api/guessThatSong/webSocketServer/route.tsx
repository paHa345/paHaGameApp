import { Server } from "socket.io";

// export default function handler(req: any, res: any) {
//   if (res.socket.server.ws) return;

//   const ws = new WebSocketServer({ server: res.socket.server });
//   res.socket.server.ws = ws;

//   ws.on("connection", (socket) => {
//     console.log("Connect");
//     socket.on("message", (message) => {
//       // Handle incoming messages
//     });
//   });

//   res.end();
// }

export default async function POST(req: any, res: any) {
  console.log("sdsf");
  const httpServer = res.socket.server;
  const io = new Server(httpServer);

  //   if (!res.socket.server.io) {
  //     io.on("connection", (socket) => {
  //       console.log("Client connected");
  //       socket.on("disconnect", () => {
  //         console.log("Client disconnected");
  //       });
  //     });
  //     res.socket.server.io = io;
  //   }
  res.end();
}
