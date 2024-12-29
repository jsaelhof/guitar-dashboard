import { Request, Response } from "express";
import DB from "../../../db/db.js";
import { Exercise } from "guitar-dashboard-types";
import { getUserCookie } from "../../../utils/get-user-cookie.js";

export const getExercise = async (req: Request, res: Response) => {
  const db = await DB();

  const { userId } = getUserCookie(req);

  const { exerciseId } = req.params;

  const exercise = userId
    ? await db
        .collection<Exercise>(`${userId}_practice`)
        .aggregate<Exercise>([
          { $match: { id: exerciseId } },
          // Join the data from the songs collection, overwriting the local "song" field (which only has the id)
          // with the song data I need for the exercise.
          {
            $lookup: {
              from: "songs",
              localField: "song.id",
              foreignField: "id",
              pipeline: [
                {
                  $project: {
                    id: 1,
                    artist: 1,
                    title: 1,
                    file: 1,
                  },
                },
              ],
              as: "song",
            },
          },
          // Unwind removes the array so that song isn't inside an array.
          { $unwind: "$song" },
          // Join the user's data for the song as "userSong"
          {
            $lookup: {
              from: `${userId}_songs`,
              localField: "song.id",
              foreignField: "id",
              pipeline: [
                {
                  $project: {
                    id: 1,
                    settings: 1,
                  },
                },
              ],
              as: "userSong",
            },
          },
          // Unwind removes the array so that userSong isn't inside an array.
          { $unwind: "$userSong" },
          // Set the song field as a merge of itself and the userSong.
          {
            $set: {
              song: { $mergeObjects: ["$song", "$userSong"] },
            },
          },
          // Remove userSong before returning.
          {
            $project: { userSong: 0 },
          },
        ])
        .next()
    : null;

  if (exercise) {
    res.send({
      error: false,
      scope: "exercise",
      type: "init",
      data: {
        exercise,
      },
    });
  } else {
    res.send({
      error: true,
      scope: "exercise",
      type: "get",
    });
  }
};
