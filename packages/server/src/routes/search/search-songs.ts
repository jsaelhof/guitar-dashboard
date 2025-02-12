import { Request, Response } from "express";
import DB from "../../db/db.js";
import { join } from "path";
import { readdir } from "fs/promises";

export const searchSongs = async (req: Request, res: Response) => {
  const db = await DB();

  const names = req.body.names;
  const dirHint = req.body.hint; // Allows the FE to provide the direcotry letter to narrow search
  console.log("Names", names);

  try {
    if (process.env.MP3_LIB) {
      const files = names.length
        ? await searchFileRecursively(
            `${process.env.MP3_LIB}${dirHint ? `/${dirHint}` : ""}`,
            names
          )
        : [];

      res.send({
        error: false,
        scope: "add",
        type: "searchSongs",
        data: {
          files,
        },
      });
    } else {
      throw "No MP3 LIB configured";
    }
  } catch (err) {
    res.status(500).send("Unable to scan directory: " + err);
  }
};

// Function to search for a file asynchronously
const searchFileRecursively = async (directory: string, filenames: string) => {
  let results = [];

  const searchDir = async (dir: string) => {
    try {
      const items = await readdir(dir, { withFileTypes: true });
      const promises = items.map(async (item) => {
        const fullPath = join(dir, item.name);
        if (item.isDirectory()) {
          return searchDir(fullPath);
        } else if (item.isFile() && filenames.includes(item.name)) {
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

// // Function to list all files recursively
// const listFilesRecursively = () => {
//   let results = [];

//   const listDir = (dir: string) => {
//     const items = readdirSync(dir);
//     items.forEach((item) => {
//       const fullPath = join(dir, item);
//       const stat = statSync(fullPath);
//       if (stat.isDirectory()) {
//         listDir(fullPath);
//       } else {
//         results.push(fullPath);
//       }
//     });
//   };

//   console.time("recurse");
//   process.env.MP3_LIB && listDir(`${process.env.MP3_LIB}/Z`);
//   console.timeEnd("recurse");
//   return results;
// };
