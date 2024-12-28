import mongoose from "mongoose";
import Workout from "./WorkoutModel";
import { IUserSchema, UserType } from "../types";
import Exercise from "./ExerciseModel";
import Comment from "./CommentModel";
import AddToCoachRequest from "./AddToCoachRequestModel";

const userSchema = new mongoose.Schema<IUserSchema>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: { type: String, required: true, minlength: 4, maxlength: 200 },
  password: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 200,
  },
  userType: { type: String, required: true },
  workoutsArr: [{ type: mongoose.Types.ObjectId, ref: Workout, required: false }],
  exercisesArr: [{ type: mongoose.Types.ObjectId, ref: Exercise, required: false }],
  reviewsArr: [{ type: mongoose.Types.ObjectId, ref: Comment, required: false }],
  coachesArr: [
    {
      coachId: { type: mongoose.Types.ObjectId, ref: "User", required: false },
      addRequestId: { type: mongoose.Types.ObjectId, ref: AddToCoachRequest, required: false },
    },
  ],
  studentsArr: [
    {
      studentId: { type: mongoose.Types.ObjectId, ref: "User", required: false },
      addRequestId: { type: mongoose.Types.ObjectId, ref: AddToCoachRequest, required: false },
    },
  ],
  // addToStudentsRequests: [
  //   {
  //     userId: { type: mongoose.Types.ObjectId, ref: "User", required: false },
  //     active: { type: Boolean, required: false },
  //   },
  // ],
  addToStudentsRequests: [
    { type: mongoose.Types.ObjectId, ref: AddToCoachRequest, required: false },
  ],
  requestToCoach: [{ type: mongoose.Types.ObjectId, ref: AddToCoachRequest, required: false }],
});

const User =
  mongoose.models.User || mongoose.model<IUserSchema>("User", userSchema, "exercisesAppUsers");

export default User;
