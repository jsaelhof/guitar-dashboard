import { Request, Response } from "express";
import DB from "../../../db/db.js";
import { Song } from "guitar-dashboard-types";
import { getUserCookie } from "../../../utils/get-user-cookie.js";

export const updatePitchSetting = async (req: Request, res: Response) => {
  const db = await DB();

  const { userId } = getUserCookie(req);

  const { songId } = req.params;
  const pitch = parseFloat(req.body.pitch);

  try {
    if (userId && songId && !isNaN(pitch) && pitch >= -100 && pitch <= 100) {
      const songData = await db
        .collection<Song>(`${userId}_songs`)
        .findOneAndUpdate(
          { id: songId },
          { $set: { "settings.pitch": pitch } },
          { returnDocument: "after" }
        );

      if (songData) {
        res.send({
          error: false,
          scope: "song",
          type: "pitch",
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
      type: "pitch",
    });
  }
};
