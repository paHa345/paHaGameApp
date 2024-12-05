import { ICrosswordSchema } from "../types";
import mongoose from "mongoose";
import Comment from "./CommentModel";
import { AddedWordDirection } from "../store/crosswordSlice";

const crosswordSchema = new mongoose.Schema<ICrosswordSchema>({
  name: { type: String, required: true },
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  isCompleted: { type: Boolean, required: true },
  changeDate: { type: Date, required: true },
  crosswordObj: [
    [
      {
        key: { type: String, required: true },
        value: { type: String, required: true },
        number: { type: Number, required: true },
        row: { type: Number, required: true },
        paragraph: { type: Number, required: true },
        paragraphNum: { type: Number, required: false },
        inputStatus: { type: Number, required: true },
        inputValue: { type: Number, required: true },
        textQuestionStatus: { type: Number, required: true },
        addedWordCell: { type: Number, required: true },
        addedWordLetter: { type: String, required: false },

        addedWordDirectionJbj: {
          horizontal: { type: Boolean, required: false },
          vertical: { type: Boolean, required: false },
        },
        // baseCell: {
        //   horizontal?: { row: number; col: number } | null;
        //   vertical?: { row: number; col: number } | null;
        // };
        baseCell: {
          horizontal: {
            row: { type: Number, required: false },
            col: { type: Number, required: false },
          },
          vertical: {
            row: { type: Number, required: false },
            col: { type: Number, required: false },
          },
        },
        addedWordArr: [
          {
            direction: { type: Number, requirted: false },
            value: { type: String, required: false },
            addedWordArr: [
              {
                row: { type: Number, required: false },
                col: { type: Number, required: false },
                addedLetter: { type: String, required: false },
              },
            ],
          },
        ],

        questionObj: {
          horizontal: {
            value: { type: String, required: false },
            questionNumber: { type: Number, required: false },
            cell: { row: Number, col: Number },
          },
          vertical: {
            value: { type: String, required: false },
            questionNumber: { type: Number, required: false },
            cell: { row: Number, col: Number },
          },
        },
      },
    ],
  ],
  questionsArr: [
    {
      direction: { type: Number, requirted: false },
      value: { type: String, required: false },
      questionNumber: { type: Number, required: false },
      cell: { row: Number, col: Number },
    },
  ],
  answersArr: {
    col: { type: Number, requirted: false },
    row: { type: Number, requirted: false },
    addedWordArr: [
      {
        direction: { type: Number, requirted: false },
        value: { type: String, required: false },
      },
    ],
  },
});

const Crossword =
  mongoose.models.Crossword ||
  mongoose.model<ICrosswordSchema>("Crossword", crosswordSchema, "crosswords");

export default Crossword;
