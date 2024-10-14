import { Request, Response } from "express";
import DB from "../../../db/db.js";
import { Song } from "../../../types/index.js";

export const deleteLoop = async (req: Request, res: Response) => {
  const db = await DB();

  const { songId } = req.params;
  const { id } = req.body;

  try {
    if (songId && id) {
      const songData = await db.collection<Song>("songs").findOneAndUpdate(
        { id: songId },
        {
          $pull: {
            loops: {
              id,
            },
          },
        },
        { returnDocument: "after" }
      );

      if (songData) {
        res.send({
          error: false,
          scope: "song",
          type: "deleteloop",
          data: {
            song: songData,
          },
        });
      } else {
        throw "Song not updated";
      }
    } else {
      throw "Missing required params";
    }
  } catch (err) {
    res.send({
      error: true,
      scope: "song",
      type: "loop",
    });
  }
};
