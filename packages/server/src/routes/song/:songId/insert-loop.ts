import { Request, Response } from "express";
import DB from "../../../db/db.js";
import { v4 as uuid } from "uuid";
import { Song } from "guitar-dashboard-types";

export const insertLoop = async (req: Request, res: Response) => {
  const db = await DB();

  const { songId } = req.params;
  const loopA = parseFloat(req.body.loopA);
  const loopB = parseFloat(req.body.loopB);
  const { label } = req.body;

  try {
    if (songId && loopA != null && loopB != null && label) {
      const songData = await db.collection<Song>("songs").findOneAndUpdate(
        { id: songId },
        {
          $push: {
            loops: {
              id: uuid(),
              loopA,
              loopB,
              label,
            },
          },
        },
        { returnDocument: "after" }
      );

      if (songData) {
        res.send({
          error: false,
          scope: "song",
          type: "loop",
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
