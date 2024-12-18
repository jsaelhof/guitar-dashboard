import { Request, Response } from "express";
import DB from "../../../db/db.js";
import { Song } from "guitar-dashboard-types";

export const updateRiffTime = async (req: Request, res: Response) => {
  const db = await DB();

  const { songId } = req.params;
  const { riffId } = req.body;
  const seconds = parseInt(req.body.seconds);

  try {
    if (songId && !isNaN(seconds) && seconds >= 0 && riffId) {
      const songData = await db.collection<Song>("songs").findOneAndUpdate(
        { id: songId, "riffs.id": riffId },
        {
          $set: {
            "riffs.$.time": seconds,
          },
        },
        { returnDocument: "after", projection: { _id: 0 } }
      );

      if (songData?.riffs) {
        res.send({
          error: false,
          scope: "song",
          type: "time",
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
    res.send({ error: true, scope: "song", type: "time" });
  }
};
