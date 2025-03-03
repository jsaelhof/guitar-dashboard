import { Request, Response } from "express";
import DB from "../../db/db.js";
import { InsertSongResult, SearchSongResult } from "guitar-dashboard-types";

export const insertSongs = async (
  req: Request<
    unknown,
    unknown,
    { files: Array<Omit<SearchSongResult, "cover">> }
  >,
  res: Response
) => {
  const db = await DB();

  const { files } = req.body;

  let sanitizedFiles: Array<Omit<SearchSongResult, "cover">> = [];
  if (files && files instanceof Array && files.length) {
    sanitizedFiles = files.filter(
      ({ path }) => process.env.MP3_LIB && path.startsWith(process.env.MP3_LIB)
    );
  }

  if (process.env.MP3_LIB && sanitizedFiles.length) {
    const filesAdded: Array<InsertSongResult> = [];

    for (const { path, artist, title } of sanitizedFiles) {
      const lastDoc = await db
        ?.collection("songs")
        ?.find({}, { projection: { _id: 0, id: 1 } })
        .sort({ id: -1 })
        .limit(1)
        .next();

      if (lastDoc) {
        const nextKey = (parseInt(lastDoc.id) + 1).toString().padStart(4, "0");

        const result = await db?.collection("songs").insertOne({
          id: nextKey,
          file: path.replace(`${process.env.MP3_LIB}/`, ""),
          artist,
          settings: {
            volume: 0.5,
          },
          title,
        });

        filesAdded.push({ path, success: !!result });
      }
    }

    res.send({
      error: false,
      scope: "songs",
      type: "insert-songs",
      data: filesAdded,
    });
  } else {
    res.send({
      error: true,
      scope: "songs",
      type: "insert-songs",
    });
  }
};
