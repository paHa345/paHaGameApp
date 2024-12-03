import mongoose from "mongoose";
import { IAttemptCrosswordGameSchema } from "../types";

const attemptCrosswordGameSchema = new mongoose.Schema<IAttemptCrosswordGameSchema>({
  telegramUserName: { type: String, required: false },
  telegramID: { type: Number, required: true },
  startDate: { type: Date, required: true },
  isCompleted: { type: Boolean, required: true },
  crosswordID: { type: String, required: true },
  completedCorrectly: { type: Boolean, required: false },
  finishDate: { type: Date, required: false },
  duration: { type: String, required: false },
  crosswordName: { type: String, required: false },
  userPhoto: { type: String, required: false },
});

const AttemptCrosswordGame =
  mongoose.models.AttemptCrosswordGame ||
  mongoose.model<IAttemptCrosswordGameSchema>(
    "AttemptCrosswordGame",
    attemptCrosswordGameSchema,
    "crosswordGameAttempts"
  );

export default AttemptCrosswordGame;
