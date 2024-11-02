import { Request, Response } from "express";
import DB from "../../../db/db.js";
import jsmediatags from "jsmediatags";
import { Song } from "guitar-dashboard-types";

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
  const { songId } = req.params;

  const songData = await db
    .collection<Song>("songs")
    .findOne<Song>({ id: songId });

  if (songData) {
    const metaData = await new Promise<Pick<Song, "album" | "year" | "cover">>(
      (resolve) => {
        jsmediatags.read(`/Volumes/Public/Music/${songData.file}`, {
          onSuccess: (tagData) => {
            const { album, year, picture } = tagData.tags ?? {};

            let cover;
            if (picture) {
              const { data, format } = picture;
              // @ts-expect-error Can't figure out how to type data. Its a number[] but needs to be something else.
              const base64String = Buffer.from(data, "binary").toString(
                "base64"
              );
              cover = `data:${format};base64,${base64String}`;
            }

            resolve({ album, year, cover });
          },
          onError: () => resolve({}),
        });
      }
    );

    res.send({
      error: false,
      scope: "song",
      type: "init",
      data: {
        song: {
          ...songData,
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
