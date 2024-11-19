import mongoose, { Mongoose } from "mongoose";
import { IAddToCoachRequstSchema, IUser } from "../types";
import User from "./UserModel";
import { ObjectId } from "mongodb";

const addToCoachRequestSchema = new mongoose.Schema<IAddToCoachRequstSchema>({
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  coachId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  active: { type: Boolean, required: true },
  rejectedByCoach: { type: Boolean, required: false },
});

addToCoachRequestSchema.pre("save", { document: true, query: false }, async function (doc, next) {
  console.log(` Coach ${this.coachId}`);
  const coach = await mongoose.model("User").findByIdAndUpdate(
    { _id: this.coachId },
    {
      $push: {
        requestToCoach: this._id,
      },
    }
  );

  const user = await mongoose.model("User").findByIdAndUpdate(
    { _id: this.userId },
    {
      $push: {
        addToStudentsRequests: this._id,
      },
    }
  );
});

addToCoachRequestSchema.pre("findOneAndUpdate", async function (result) {
  try {
    if (JSON.stringify(this.getUpdate()).includes("rejectedByCoach")) {
      const updatedDoc: IAddToCoachRequstSchema | null = await mongoose
        .model("AddToCoachRequest")
        .findOne({ _id: this.getQuery()._id._id });

      if (updatedDoc === null) {
        throw new Error("Не найден запрос");
      }

      const coach = await mongoose.model("User").aggregate([
        {
          $match: {
            _id: updatedDoc?.coachId,
          },
        },
      ]);

      console.log(coach);

      const coachUpdated = await mongoose.model("User").findByIdAndUpdate(updatedDoc?.coachId, {
        $pull: {
          requestToCoach: String(updatedDoc?._id),
          studentsArr: {
            addRequestId: String(updatedDoc?._id),
          },
        },
      });

      console.log("coach updated");
      console.log(String(updatedDoc?._id));
      console.log(coachUpdated);

      if (coach.length !== 0) {
        // можно прокинуть ошибку
        //   throw new Error("Не удалось обновить БД, повторите запрос позже");
      } else {
      }

      const userUpdated = await mongoose.model("User").findByIdAndUpdate(updatedDoc?.userId, {
        $pull: {
          coachesArr: {
            addRequestId: String(updatedDoc?._id),
          },
        },
      });

      // удалить из списка студентов объект и удалить из списка тренеров у пользователя
      // тренера
    }
    if (JSON.stringify(this.getUpdate()).includes("active")) {
      const updatedDoc: IAddToCoachRequstSchema | null = await mongoose
        .model("AddToCoachRequest")
        .findOne({ _id: this.getQuery()._id._id });

      if (updatedDoc === null) {
        throw new Error("Не найден запрос");
      }

      const coach = await mongoose.model("User").aggregate([
        {
          $match: {
            $and: [
              { _id: updatedDoc?.coachId },
              { "studentsArr.studentId": String(updatedDoc?.userId) },
            ],
          },
        },
      ]);

      if (coach.length !== 0) {
        // можно прокинуть ошибку
        //   throw new Error("Не удалось обновить БД, повторите запрос позже");
      } else {
        const coachUpdated = await mongoose.model("User").findByIdAndUpdate(
          { _id: updatedDoc?.coachId },
          {
            $push: {
              studentsArr: {
                studentId: String(updatedDoc?.userId),
                addRequestId: String(updatedDoc?._id),
              },
            },
          }
        );
      }

      const user = await mongoose.model("User").aggregate([
        {
          $match: {
            $and: [
              { _id: updatedDoc?.userId },
              { "coachesArr.coachId": { $in: [String(updatedDoc?.coachId)] } },
            ],
          },
        },
      ]);

      if (user.length !== 0) {
        // можно прокинуть ошибку
        //   throw new Error("Не удалось обновить БД, повторите запрос позже");
      } else {
        const userUpdated = await mongoose.model("User").findByIdAndUpdate(
          { _id: updatedDoc?.userId },
          {
            $push: {
              coachesArr: {
                coachId: String(updatedDoc?.coachId),
                addRequestId: String(updatedDoc?._id),
              },
            },
          }
        );
      }
    }
  } catch (error: any) {
    console.log(error);
    throw new Error(`Не удалось обновить БД, повторите запрос позже. ${error.message}`);
  }
});

addToCoachRequestSchema.pre("deleteOne", async function (result) {
  try {
    console.log("Query delete doc");
    console.log(this.getQuery());
    const updatedDoc: IAddToCoachRequstSchema | null = await mongoose
      .model("AddToCoachRequest")
      .findOne({ _id: this.getQuery()._id });
    const coach = await mongoose.model("User").findByIdAndUpdate(updatedDoc?.coachId, {
      $pull: {
        studentsArr: { addRequestId: updatedDoc?._id },
        requestToCoach: updatedDoc?._id,
      },
    });

    const student = await mongoose.model("User").findByIdAndUpdate(updatedDoc?.userId, {
      $pull: {
        coachesArr: { addRequestId: updatedDoc?._id },
        addToStudentsRequests: updatedDoc?._id,
      },
    });
    // console.log(student);

    // throw new Error("Test error");
  } catch (error: any) {
    console.log(error);
    throw new Error(`Не удалось обновить БД, повторите запрос позже. ${error.message}`);
  }
});

const AddToCoachRequest =
  mongoose.models.AddToCoachRequest ||
  mongoose.model<IAddToCoachRequstSchema>(
    "AddToCoachRequest",
    addToCoachRequestSchema,
    "execisesAppAddToCoachRequest"
  );

export default AddToCoachRequest;
