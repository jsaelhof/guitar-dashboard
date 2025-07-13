import { Request, Response } from "express";
import DB from "../../../db/db.js";
import { Song } from "guitar-dashboard-types";
import { getUserCookie } from "../../../utils/get-user-cookie.js";

export const updateStartDelaySetting = async (req: Request, res: Response) => {
  const db = await DB();

  const { userId } = getUserCookie(req);

  const { songId } = req.params;
  const startDelay = req.body.startDelay;

  try {
    if (userId && songId && startDelay != null) {
      const songData = await db
        .collection<Song>(`${userId}_songs`)
        .findOneAndUpdate(
          { id: songId },
          { $set: { "settings.startDelay": startDelay } },
          { returnDocument: "after" }
        );

      if (songData) {
        res.send({
          error: false,
          scope: "song",
          type: "startDelay",
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
      type: "startDelay",
    });
  }
};
