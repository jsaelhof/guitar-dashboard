import { Request, Response } from "express";
import DB from "../../../db/db.js";
import { Song } from "guitar-dashboard-types";
import { v4 as uuid } from "uuid";

export const addVideo = async (req: Request, res: Response) => {
  const db = await DB();

  const { songId } = req.params;
  const { url, desc } = req.body;

  try {
    if (songId && url) {
      const songData = await db
        .collection<Song>("songs")
        .findOneAndUpdate(
          { id: songId },
          { $push: { videos: { id: uuid(), url, desc } } },
          { returnDocument: "after" }
        );

      if (songData) {
        res.send({
          error: false,
          scope: "song",
          type: "addvideo",
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
      type: "addvideo",
    });
  }
};
