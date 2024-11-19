import { IWorkoutSchema } from "../types";
import mongoose from "mongoose";
import Exercise from "./ExerciseModel";

const workoutSchema = new mongoose.Schema<IWorkoutSchema>({
  comments: { type: String, required: false },
  date: { type: Date, required: true },
  userId: { type: String, required: true },
  studentsIdArr: [{ type: String, required: true }],
  name: { type: String, required: false, default: String(Date.now()) },
  exercisesArr: [
    {
      name: { type: String, required: true },
      exercise: { type: String, ref: Exercise, required: true },
      exerciseId: { type: String, required: true },
      sets: { type: Number, required: true },
      reps: { type: Number, required: true },
      isCompletedArr: [
        {
          studentId: { type: String, required: false },
          isCompleted: { type: Boolean, required: false },
        },
      ],
    },
  ],
});

const Workout =
  mongoose.models.Workout ||
  mongoose.model<IWorkoutSchema>("Workout", workoutSchema, "testWorkout");

export default Workout;
