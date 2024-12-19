import { Request, Response } from "express";
import DB from "../../db/db.js";
import { getRecentSongs } from "./utils/get-recent-songs.js";
import { Song } from "guitar-dashboard-types";
import { getUserCookie } from "../../utils/get-user-cookie.js";

export const updateRecentSongs = async (req: Request, res: Response) => {
  const db = await DB();

  const { userId } = getUserCookie(req);

  const { songId } = req.body;

  if (songId) {
    // When a song is added as a recent play, update its play count metric and lastPlayed time.
    await db.collection<Song>(`${userId}_songs`).findOneAndUpdate(
      { id: songId },
      {
        $inc: { "metrics.plays": 1 },
        $set: { "metrics.lastPlayed": Date.now() },
      }
    );

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
