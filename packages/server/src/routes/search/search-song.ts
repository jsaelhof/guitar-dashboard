import { Request, Response } from "express";
import { join } from "path";
import { readdir } from "fs/promises";
import { getSongMetadata } from "../../utils/get-song-metadata.js";
import { SearchSongResults } from "guitar-dashboard-types";

export const searchSong = async (req: Request, res: Response) => {
  const { search, artist } = req.body;

  try {
    if (process.env.MP3_LIB && search) {
      const results = await searchFileRecursively(artist, search);

      res.send({
        error: false,
        scope: "add",
        type: "searchSong",
        data: results,
      });
    } else {
      throw "Missing required params";
    }
  } catch (err) {
    res.status(500).send("Unable to scan directory: " + err);
  }
};

// Function to search for a file asynchronously
const searchFileRecursively = async (artist: string, search: string) => {
  let results: string[] = [];

  // If any artist is provided, use the first letter to limit which sub-directory of the MP3 lib to search in.
  const subDir = `${process.env.MP3_LIB}${
    artist ? `/${artist.charAt(0).toUpperCase()}` : ""
  }`;

  const searchDir = async (dir: string) => {
    try {
      const items = await readdir(dir, { withFileTypes: true });
      const promises = items.map(async (item) => {
        const fullPath = join(dir, item.name);
        if (item.isDirectory()) {
          return searchDir(fullPath);
        } else if (
          item.isFile() &&
          !item.name.startsWith(".") &&
          item.name.endsWith(".mp3") &&
          item.name.toLowerCase().includes(search.toLowerCase()) &&
          // If an artist was provided, I use the first letter to restrict which sub-dir to search.
          // Within that dir, if the artist-level dir includes the entire artist sub-string, I can prevent other artists with similar songs
          // from being included in the results. This doesn't speed it up, but it limits the results.
          (!artist || dir.toLowerCase().includes(`/${artist.toLowerCase()}`))
        ) {
          results.push(fullPath);
        }
      });
      await Promise.all(promises);
    } catch (err) {
      console.error(`Unable to scan directory: ${dir}, Error: ${err}`);
    }
  };

  await searchDir(subDir);

  return await results.reduce<Promise<SearchSongResults>>(
    async (promiseCollection, track) => {
      const collection = await promiseCollection;

      const [_, artist, album, filename] = track
        .replace(`${process.env.MP3_LIB}/`, "")
        .split("/");

      if (!collection[artist]) collection[artist] = {};
      if (!collection[artist][album]) collection[artist][album] = [];

      const metadata = await getSongMetadata(track);

      collection[artist][album].push({
        path: track,
        filename,
        cover: metadata.cover,
        title: metadata.title,
        album: metadata.album,
        artist: metadata.artist,
      });

      return collection;
    },
    Promise.resolve({})
  );
};
