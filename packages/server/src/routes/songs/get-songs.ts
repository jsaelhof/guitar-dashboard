import { Request, Response } from "express";
import DB from "../../db/db.js";
import { getRecentSongs } from "./utils/get-recent-songs.js";
import { Song, SongsByArtist, SongTitleList } from "../../types/index.js";

export const getSongs = async (req: Request, res: Response) => {
  const db = await DB();

  const recentSongs = await getRecentSongs();

  // Execute the aggregation, send the returned cursor to an array and then reduce it.
  // This turns each { _id: <artist>, songs: [ "Song 1", "Song 2", ... ] } into { artist: ["Song 1", "Song 2", ...] }
  const songsByArtist = (
    await db
      .collection<Song>("songs")
      .aggregate<{ _id: string; songs: SongTitleList }>([
        // Sort the songs alphabetically by title.
        { $sort: { title: 1 } },
        // Group all the songs by artist. The songs array will be sorted alphabetically b/c it respects the order of the sort in the previous stage.
        {
          $group: {
            _id: "$artist",
            songs: { $push: { id: "$id", title: "$title" } },
          },
        },
        // Now that the songs are grouped by artist, sort the list of artists alphabetically.
        { $sort: { _id: 1 } },
      ])
      .toArray()
  ).reduce<SongsByArtist>((acc, { _id, songs }) => {
    acc[_id] = songs;
    return acc;
  }, {});

  res.send({
    error: false,
    scope: "songs",
    type: "init",
    data: {
      songsByArtist,
      recentSongs,
    },
  });
};
