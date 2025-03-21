import { Request, Response } from "express";
import DB from "../../../db/db.js";
import { Song } from "guitar-dashboard-types";
import { getUserCookie } from "../../../utils/get-user-cookie.js";

export const updateLoop = async (req: Request, res: Response) => {
  const db = await DB();

  const { userId } = getUserCookie(req);

  const { songId } = req.params;
  const loopA = parseFloat(req.body.loopA);
  const loopB = parseFloat(req.body.loopB);
  const { id, label } = req.body;

  try {
    if (userId && songId && id && loopA != null && loopB != null && label) {
      // TODO: Handle songData = null;
      const songData = await db
        .collection<Song>(`${userId}_songs`)
        .findOneAndUpdate(
          { id: songId, "loops.id": id },
          {
            $set: {
              "loops.$.label": label,
              "loops.$.loopA": loopA,
              "loops.$.loopB": loopB,
            },
          },
          { returnDocument: "after" }
        );

      if (songData) {
        res.send({
          error: false,
          scope: "song",
          type: "updateloop",
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
