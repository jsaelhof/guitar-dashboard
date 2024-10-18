import { Request, Response } from "express";
import DB from "../../../db/db.js";
import { Song } from "guitar-dashboard-types";

export const getTablature = async (req: Request, res: Response) => {
  const db = await DB();

  const { songId } = req.params;

  try {
    if (songId) {
      const songData = await db
        .collection<Song>("songs")
        .findOne({ id: songId }, { projection: { _id: 0, tablature: 1 } });

      if (songData) {
        res.send({
          error: false,
          scope: "tab",
          type: "init",
          data: {
            songId,
            tab: songData.tablature ?? [],
          },
        });
      } else {
        throw "Song not found";
      }
    } else {
      throw "Missing required params";
    }
  } catch (err) {
    res.send({
      error: true,
      scope: "tab",
      type: "init",
    });
  }
};
