import { Request, Response } from "express";
import DB from "../../../db/db.js";
import { Song } from "../../../types/index.js";

export const getRiffs = async (req: Request, res: Response) => {
  const db = await DB();

  const { songId } = req.params;

  const songData = await db
    .collection<Song>("songs")
    .findOne({ id: songId }, { projection: { _id: 0, riffs: 1 } });

  if (songData) {
    res.send({
      error: false,
      scope: "riffs",
      type: "init",
      data: {
        songId,
        riffs: songData.riffs ?? [],
      },
    });
  } else {
    res.send({
      error: true,
      scope: "riffs",
      type: "init",
    });
  }
};
