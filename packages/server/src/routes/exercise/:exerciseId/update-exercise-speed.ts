import { Request, Response } from "express";
import DB from "../../../db/db.js";
import { Exercise } from "guitar-dashboard-types";
import { getUserCookie } from "../../../utils/get-user-cookie.js";

export const updateExerciseSpeed = async (req: Request, res: Response) => {
  const db = await DB();

  const { userId } = getUserCookie(req);

  const { exerciseId } = req.params;
  const speed = parseFloat(req.body.speed);

  try {
    if (userId && exerciseId && !isNaN(speed) && speed >= 0 && speed <= 1) {
      const exerciseData = await db
        .collection<Exercise>(`${userId}_practice`)
        .findOneAndUpdate(
          { id: exerciseId },
          { $set: { speed } },
          { returnDocument: "after", upsert: true }
        );

      if (exerciseData) {
        res.send({
          error: false,
          scope: "exercise",
          type: "speed",
          data: {
            exercise: exerciseData,
          },
        });
      } else {
        throw "Exercise not updated";
      }
    } else {
      throw "Missing required params";
    }
  } catch (err) {
    res.send({
      error: true,
      scope: "exercise",
      type: "speed",
    });
  }
};
