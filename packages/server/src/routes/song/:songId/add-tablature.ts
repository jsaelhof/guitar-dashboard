import { Request, Response } from "express";
import DB from "../../../db/db.js";
import { Song, Tablature } from "guitar-dashboard-types";

export const addTablature = async (req: Request, res: Response) => {
  const db = await DB();

  const { songId } = req.params;
  const tab = req.body as Tablature;

  try {
    if (songId && tab) {
      const songData = await db.collection<Song>("songs").findOneAndUpdate(
        { id: songId },
        {
          $push: {
            tablature: {
              ...tab,
              format: "ug2", // For now, I'm assuming all new tab being added is in the ug2 format.
            },
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
