import mongoose from "mongoose";
import { IGTSGameSchema } from "../types";

const GTSGameSchema = new mongoose.Schema<IGTSGameSchema>({
  name: { type: String, required: true },
  userID: { type: String, required: true },
  isCompleted: { type: Boolean, required: true },
  // isCorrect: { type: Boolean, required: true },
  changeDate: { type: Date, required: true },
  GTSGameObj: [
    {
      songURL: { type: String, required: true },
      correctAnswer: { type: Number, required: true },
      answersArr: [{ text: { type: String, required: true } }],
    },
  ],
});

const GTSGame =
  mongoose.models.GTSGame || mongoose.model<IGTSGameSchema>("GTSGame", GTSGameSchema, "GTSGames");

export default GTSGame;
