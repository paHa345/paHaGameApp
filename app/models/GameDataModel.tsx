import mongoose from "mongoose";
import { IGameDataSchema } from "../types";

const gameDataSchema = new mongoose.Schema<IGameDataSchema>({
  chooseGameButtonData: [
    {
      pathname: { type: String, required: true },
      title: { type: String, required: true },
      description: { type: String, required: true },
      color: { type: String, required: true },
      textSecoundStep: { type: String, required: true },
    },
  ],
});

const GameData =
  mongoose.models.GameData ||
  mongoose.model<IGameDataSchema>("GameData", gameDataSchema, "gameData");

export default GameData;
