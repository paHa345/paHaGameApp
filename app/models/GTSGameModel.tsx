import mongoose from "mongoose";
import { IGTSGameSchema } from "../types";
import { GTSCreatedGameComplexity } from "../store/GTSCreateGameSlice";

const GTSGameSchema = new mongoose.Schema<IGTSGameSchema>({
  name: { type: String, required: true },
  userID: { type: String, required: true },
  isCompleted: { type: Boolean, required: true },
  // isCorrect: { type: Boolean, required: true },
  gameComplexity: { type: Number, required: true },
  changeDate: { type: Date, required: true },
  GTSGameObj: [
    {
      songURL: { type: String, required: true },
      imageURL: { type: String, required: false },
      correctAnswerIndex: { type: Number, required: true },
      answersArr: [{ text: { type: String, required: true } }],
    },
  ],
});

//уникальное имя, проверяет все документы в коллекции
// и если есть с таким же полем name то будет ошибка загрузки
GTSGameSchema.pre("save", { document: true, query: false }, async function (doc, next) {
  const IsGTSGameInDB = await mongoose.model("GTSGame").findOne({ name: this.name });

  console.log(IsGTSGameInDB);
  if (IsGTSGameInDB) {
    throw new Error("Игра с таким именем уже существует. Измените имя");
  }
});
GTSGameSchema.index({ name: 1 }, { unique: true });

//тут "GTSGames" это имя коллекции в базе данных
const GTSGame =
  mongoose.models.GTSGame || mongoose.model<IGTSGameSchema>("GTSGame", GTSGameSchema, "GTSGames");

export default GTSGame;
