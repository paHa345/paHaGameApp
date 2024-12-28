import { IExerciseSchema } from "../types";
import mongoose from "mongoose";
import Comment from "./CommentModel";

const execiseSchema = new mongoose.Schema<IExerciseSchema>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  image: { type: String, required: false },
  // imageFile: { type: File, required: false },
  isBest: { type: Boolean, required: false },
  type: { type: String, required: true },
  raiting: { type: Number, required: false },
  muscleGroups: [{ type: String, required: true }],
  video: { type: String, required: false },
  description: { type: String, required: true },
  mainGroup: { type: String, required: true },
  mainGroupRu: { type: String, required: true },
  commentsArr: [{ type: mongoose.Schema.Types.ObjectId, required: false, ref: Comment }],
  createdUserId: { type: String, required: false },
  avgUsersRaiting: { type: String, required: false },
});

execiseSchema.index({ id: 1, name: 1 }, { unique: true });

// execiseSchema.pre("find", (next, docs) => {
//   console.log(`Pre find hook this ${docs}`);
//   // console.log(`Pre find hook documents ${documents}`);
//   return next();
// });

// execiseSchema.pre(["updateOne", "findOneAndUpdate"], async function (next) {
//   console.log(`Pre update hook ${this}`);
//   console.log(this.getQuery()._id);
//   // как получить id текущего элемента из this
//   // тут this - это поисковой запрос
//   // так работает, ищет необходимую информацию
//   // const data = await Comment.find({ exerciseId: String(this.getQuery()._id) });
//   const data = await Comment.aggregate([{ $group: { _id: null, avgRaiting: { $avg: "$score" } } }]);
//   console.log(data[0].avgRaiting);

//   const testNum = 2.722272727272727;
//   console.log(Math.round(testNum * 100) / 100);

//   // так работает, обновляется нужное поле
//   this.updateOne({ testValue: String(Math.round(testNum * 100) / 100) });

//   return next();
// });

const Exercise =
  mongoose.models.Exercise ||
  mongoose.model<IExerciseSchema>("Exercise", execiseSchema, "exercises");

export default Exercise;
