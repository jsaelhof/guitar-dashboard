import { Request, Response } from "express";
import DB from "../../../db/db.js";
import { Song } from "guitar-dashboard-types";

export const addTablature = async (req: Request, res: Response) => {
  const db = await DB();

  const { songId } = req.params;
  const tab = req.body;

  try {
    if (songId && tab) {
      const songData = await db.collection<Song>("songs").findOneAndUpdate(
        { id: songId },
        {
          $push: {
            tablature: tab,
          },
        },
        { returnDocument: "after", projection: { _id: 0 } }
      );

      if (songData?.tablature) {
        res.send({
          error: false,
          scope: "song",
          type: "add",
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
    res.send({ error: true, scope: "song", type: "add" });
  }
};
