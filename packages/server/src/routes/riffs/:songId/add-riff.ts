import { Request, Response } from "express";
import DB from "../../../db/db.js";
import { Song } from "../../../types/index.js";

export const addRiff = async (req: Request, res: Response) => {
  const db = await DB();

  const { songId } = req.params;
  const riff = req.body;

  try {
    if (songId && riff) {
      const songData = await db.collection<Song>("songs").findOneAndUpdate(
        { id: songId },
        {
          $push: {
            riffs: riff,
          },
        },
        { returnDocument: "after", projection: { _id: 0, riffs: 1 } }
      );

      if (songData) {
        res.send({
          error: false,
          scope: "riffs",
          type: "add",
          data: {
            songId,
            riffs: songData?.riffs,
          },
        });
      } else {
        throw "Song not updated";
      }
    } else {
      throw "Missing required params";
    }
  } catch (err) {
    res.send({ error: true, scope: "riffs", type: "add" });
  }
};
