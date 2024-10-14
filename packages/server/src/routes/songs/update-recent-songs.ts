import { Request, Response } from "express";
import DB from "../../db/db.js";
import { getRecentSongs } from "./utils/get-recent-songs.js";
import { RecentSongRecord, Song } from "../../types/index.js";

export const updateRecentSongs = async (req: Request, res: Response) => {
  const db = await DB();

  const { songId } = req.body;

  if (songId) {
    // Repace (or insert if new) the recent song record, updating the timestamp.
    await db
      .collection<RecentSongRecord>("recentSongs")
      .replaceOne(
        { id: songId },
        { id: songId, timestamp: Date.now() },
        { upsert: true }
      );

    // When a song is added as a recent play, update its play count metric.
    await db
      .collection<Song>("songs")
      .findOneAndUpdate({ id: songId }, { $inc: { "metrics.plays": 1 } });

    const recentSongs = await getRecentSongs();

    res.send({
      error: false,
      scope: "recent",
      type: "add",
      data: {
        recentSongs,
      },
    });
  } else {
    res.send({
      error: true,
      scope: "recent",
      type: "add",
    });
  }
};
