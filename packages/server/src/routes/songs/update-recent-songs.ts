import { Request, Response } from "express";
import DB from "../../db/db.js";
import { getRecentSongs } from "./utils/get-recent-songs.js";
import { RecentSongRecord } from "../../types/index.js";
import { Song } from "guitar-dashboard-types";
import { getUserCookie } from "../../utils/get-user-cookie.js";

export const updateRecentSongs = async (req: Request, res: Response) => {
  const db = await DB();

  const { userId } = getUserCookie(req);

  const { songId } = req.body;

  if (songId) {
    // Repace (or insert if new) the recent song record, updating the timestamp.
    // FIXME: Instead of setting timestamp in the user's recent songs colelction, just set it in the user's songs collection with other personal settings. Then i can remove that entire collection.
    await db
      .collection<RecentSongRecord>(`${userId}_recentSongs`)
      .replaceOne(
        { id: songId },
        { id: songId, timestamp: Date.now() },
        { upsert: true }
      );

    // When a song is added as a recent play, update its play count metric.
    await db
      .collection<Song>("songs")
      .findOneAndUpdate({ id: songId }, { $inc: { "metrics.plays": 1 } });

    const recentSongs = await getRecentSongs(req);

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
