import { Request, Response } from "express";
import DB from "../../../db/db.js";
import { Song } from "../../../types/index.js";

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
        { returnDocument: "after", projection: { _id: 0, tablature: 1 } }
      );

      if (songData?.tablature) {
        res.send({
          error: false,
          scope: "tab",
          type: "add",
          data: {
            songId,
            tab: songData.tablature,
          },
        });
      } else {
        throw "Song not updated";
      }
    } else {
      throw "Missing required params";
    }
  } catch (err) {
    res.send({ error: true, scope: "tab", type: "add" });
  }
};
