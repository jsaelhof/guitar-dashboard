import { Request, Response } from "express";
import DB from "../../../db/db.js";
import { Song } from "guitar-dashboard-types";
import { getUserCookie } from "../../../utils/get-user-cookie.js";
import { getSongMetadata } from "../../../utils/get-song-metadata.js";

const processRiffs = (song: Song): Pick<Song, "riffs" | "riffTimes"> => {
  // If this riff clones another, find it and overlay this data over the cloned data.
  // This allows a riff to clone another one and just change the label/time
  const riffs = song.riffs ?? [];
  const processedRiffData = riffs.map((riff) =>
    riff.clones
      ? { ...riffs.find(({ id }) => riff.clones === id), ...riff }
      : riff
  );

  // Find the times associated with each riff.
  const riffTimes = processedRiffData.reduce<number[] | undefined>(
    (acc, riff) => {
      if (riff.time !== undefined) {
        if (!acc) acc = [];
        acc.push(riff.time);
      }
      return acc;
    },
    undefined
  );

  return {
    riffs,
    riffTimes,
  };
};

export const getSong = async (req: Request, res: Response) => {
  const db = await DB();

  const { userId } = getUserCookie(req);

  const { songId } = req.params;

  const songData = await db
    .collection<Song>("songs")
    .findOne<Song>({ id: songId });

  const userSongData = userId
    ? await db.collection<Song>(`${userId}_songs`).findOne<Song>({ id: songId })
    : null;

  if (songData) {
    const metaData = await getSongMetadata(
      `${process.env.MP3_LIB}/${songData.file}`
    );

    res.send({
      error: false,
      scope: "song",
      type: "init",
      data: {
        song: {
          ...songData,
          ...(userSongData ?? {}),
          settings: {
            ...(songData.settings ?? {}),
            ...(userSongData?.settings ?? {}),
          },
          ...processRiffs(songData),
          ...metaData,
        },
      },
    });
  } else {
    res.send({
      error: true,
      scope: "song",
      type: "get",
    });
  }
};
