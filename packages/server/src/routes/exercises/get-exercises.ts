import { Request, Response } from "express";
import DB from "../../db/db.js";
import { Exercise } from "guitar-dashboard-types";
import { getUserCookie } from "../../utils/get-user-cookie.js";

export const getExercises = async (req: Request, res: Response) => {
  const db = await DB();

  const { userId } = getUserCookie(req);

  const exercises = userId
    ? await db.collection<Exercise[]>(`${userId}_practice`).find({}).toArray()
    : null;

  if (exercises) {
    res.send({
      error: false,
      scope: "exercises",
      type: "init",
      data: {
        exercises,
      },
    });
  } else {
    res.send({
      error: true,
      scope: "exercises",
      type: "get",
    });
  }
};
