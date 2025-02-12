import { Request, Response } from "express";
import DB from "../../db/db.js";
import { join } from "path";
import { readdir } from "fs/promises";

export const searchSong = async (req: Request, res: Response) => {
  const db = await DB();

  const { search, artist } = req.body;

  try {
    if (process.env.MP3_LIB && search) {
      const files = await searchFileRecursively(
        `${process.env.MP3_LIB}${
          artist ? `/${artist.charAt(0).toUpperCase()}` : ""
        }`,
        search
      );

      res.send({
        error: false,
        scope: "add",
        type: "searchSong",
        data: {
          files,
        },
      });
    } else {
      throw "Missing required params";
    }
  } catch (err) {
    res.status(500).send("Unable to scan directory: " + err);
  }
};

// Function to search for a file asynchronously
const searchFileRecursively = async (directory: string, search: string) => {
  let results: string[] = [];

  const searchDir = async (dir: string) => {
    try {
      const items = await readdir(dir, { withFileTypes: true });
      const promises = items.map(async (item) => {
        const fullPath = join(dir, item.name);
        if (item.isDirectory()) {
          return searchDir(fullPath);
        } else if (
          item.isFile() &&
          item.name.toLowerCase().includes(search.toLowerCase())
        ) {
          results.push(fullPath);
        }
      });
      await Promise.all(promises);
    } catch (err) {
      console.error(`Unable to scan directory: ${dir}, Error: ${err}`);
    }
  };

  await searchDir(directory);
  return results;
};
