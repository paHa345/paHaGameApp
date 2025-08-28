import mongoose from "mongoose";
import { IGameRoomSchema } from "../types";

const GameRoomSchema = new mongoose.Schema<IGameRoomSchema>({
  name: { type: String, required: true },
  isStarted: { type: String, required: true },
});

const GameRoom =
  mongoose.models.GameRoom ||
  mongoose.model<IGameRoomSchema>("GameRoom", GameRoomSchema, "gameRooms");

export default GameRoom;
