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
  durationNumberMs: { type: Number, required: false },
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  userAnswers: [
    {
      row: { type: Number, required: false },
      col: { type: Number, required: false },
      addedWordArr: [
        {
          direction: { type: Number, required: false },
          value: { type: String, required: false },
          isCorrect: { type: Boolean, required: false },
          question: { type: String, required: false },
        },
      ],
    },
  ],
});

const AttemptCrosswordGame =
  mongoose.models.AttemptCrosswordGame ||
  mongoose.model<IAttemptCrosswordGameSchema>(
    "AttemptCrosswordGame",
    attemptCrosswordGameSchema,
    "crosswordGameAttempts"
  );

export default AttemptCrosswordGame;
