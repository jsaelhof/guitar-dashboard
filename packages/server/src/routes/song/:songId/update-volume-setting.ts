import { Request, Response } from "express";
import DB from "../../../db/db.js";
import { Song } from "guitar-dashboard-types";
import { getUserCookie } from "../../../utils/get-user-cookie.js";

export const updateVolumeSetting = async (req: Request, res: Response) => {
  const db = await DB();

  const { userId } = getUserCookie(req);

  const { songId } = req.params;
  const volume = parseFloat(req.body.volume);

  try {
    if (userId && songId && !isNaN(volume) && volume >= 0 && volume <= 1) {
      const songData = await db
        .collection<Song>(`${userId}_songs`)
        .findOneAndUpdate(
          { id: songId },
          { $set: { "settings.volume": volume } },
          { returnDocument: "after", upsert: true }
        );

      if (songData) {
        res.send({
          error: false,
          scope: "song",
          type: "volume",
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
      type: "volume",
    });
  }
};
