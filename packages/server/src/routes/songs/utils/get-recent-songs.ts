import DB from "../../../db/db.js";
import { RecentSong } from "guitar-dashboard-types";
import { RecentSongRecord } from "../../../types/index.js";
import { Request } from "express";
import { getUserCookie } from "../../../utils/get-user-cookie.js";

export const getRecentSongs = async (req: Request) => {
  const db = await DB();

  const { userId } = getUserCookie(req);

  return await db
    .collection<RecentSongRecord>(`${userId}_recentSongs`)
    .aggregate<RecentSong>([
      // For each id, find the matching document in the songs collection.
      // There will only be one match in the array set as the value of "as" which will be picked out by $first and used to replace the root.
      {
        $lookup: {
          from: "songs",
          localField: "id",
          foreignField: "id",
          pipeline: [{ $project: { id: 1, artist: 1, title: 1, file: 1 } }],
          as: "songs",
        },
      },
      { $sort: { timestamp: -1 } },
      { $replaceRoot: { newRoot: { $first: "$songs" } } },
    ])
    .toArray();
};
