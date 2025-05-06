import DB from "../../../db/db.js";
import { RecentSong } from "guitar-dashboard-types";
import { UserSongData } from "../../../types/index.js";
import { Request } from "express";
import { getUserCookie } from "../../../utils/get-user-cookie.js";
import { getSongMetadata } from "../../../utils/get-song-metadata.js";

export const getRecentSongs = async (req: Request) => {
  const db = await DB();

  const { userId } = getUserCookie(req);

  const recentSongs = await db
    .collection<UserSongData>(`${userId}_songs`)
    .aggregate<Pick<RecentSong, "id" | "title" | "artist" | "file">>([
      { $match: { "metrics.lastPlayed": { $ne: null } } },
      { $sort: { "metrics.lastPlayed": -1 } },
      { $limit: 32 },
      // Join data from the user's data (play counts) with the song data from the songs collection.
      // For each id, find the matching document in the songs collection.
      // There will only be one match in the array set as the value of "as" which will be picked out by $first and used to replace the root.
      {
        $lookup: {
          from: "songs",
          localField: "id",
          foreignField: "id",
          pipeline: [
            {
              $project: {
                id: 1,
                artist: 1,
                title: 1,
                file: 1,
              },
            },
          ],
          as: "songs",
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              { $first: "$songs" }, // The first song object in "songs" from the lookup above
              "$$ROOT", // The userData object
            ],
          },
        },
      },
      {
        $project: {
          "metrics.plays": 0,
          settings: 0, // Remove settings, don't need it.
          songs: 0, // The { $first: "$songs" } gets spread into the root but also stays in the original location. This removes it.
        },
      },
    ])
    .toArray();

  // Get the metadata for each song and add it.
  const metadataPromises = recentSongs.map<Promise<RecentSong>>(
    async (recentSong) => {
      const metaData = await getSongMetadata(
        `${process.env.MP3_LIB}/${recentSong.file}`
      );

      return {
        ...recentSong,
        ...metaData,
      };
    }
  );

  return await Promise.all(metadataPromises);
};
