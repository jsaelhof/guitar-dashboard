import { Request, Response } from "express";
import DB from "../../../db/db.js";
import { exec } from "child_process";

export const playSong = async (req: Request, res: Response) => {
  const db = await DB();

  const { songId } = req.params;

  // TODO: Handle songData = null;
  const songData = await db
    .collection("songs")
    .findOne({ id: songId }, { projection: { file: 1 } });

  if (songData) {
    const { file } = songData;

    exec(
      `open -a "iina" "${process.env.MP3_LIB}/${file}"`,
      (error, stdout, stderr) => {
        console.log(error);
      }
    );

    res.send({
      error: false,
      scope: "songs",
      type: "play",
    });
  } else {
    res.send({
      error: true,
      scope: "songs",
      type: "play",
    });
  }
};
