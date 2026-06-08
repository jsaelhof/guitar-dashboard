import { Request, Response } from "express";
import DB from "../../../db/db.js";
import { Song } from "guitar-dashboard-types";
import { readdir, rmdir, unlink } from "fs/promises";
import { join } from "path";

export const deleteTablature = async (
  req: Request<{ songId?: string }, any, { id: string }>,
  res: Response,
) => {
  const db = await DB();

  const { songId } = req.params;
  const { id } = req.body;

  const cleanupFilesAndDir = async (outputDir: string) => {
    const files = await readdir(outputDir);

    await Promise.all(files.map((file) => unlink(join(outputDir, file))));

    await rmdir(outputDir);
  };

  try {
    if (!process.env.ASSETS) throw new Error("No ASSETS directory");

    if (songId && id) {
      const songData = await db
        .collection<Song>("songs")
        .findOneAndUpdate(
          { id: songId },
          { $pull: { tablature: { id } } },
          { returnDocument: "before" },
        );

      const tabDir = join(process.env.ASSETS, songId, "tab", id);
      await cleanupFilesAndDir(tabDir);

      if (songData) {
        res.send({
          error: false,
          scope: "song",
          type: "deletetablature",
          data: {
            song: {
              ...songData,
              tablature: songData.tablature?.filter(
                (tablatureItem) => tablatureItem.id !== id,
              ),
            },
          },
        });
      } else {
        throw "Song not updated";
      }
    } else {
      throw "Missing required params";
    }
  } catch (err) {
    res.send({
      error: true,
      scope: "song",
      type: "deletetablature",
    });
  }
};
