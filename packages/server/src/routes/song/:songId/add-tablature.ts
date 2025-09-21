import { Request, Response } from "express";
import DB from "../../../db/db.js";
import { Song, TablatureInput } from "guitar-dashboard-types";
import { join } from "path";
import { writeFile, unlink, mkdir, access } from "fs/promises";

/**
 * Writes a data URI to a PNG file
 * @param {string} dataUri - The data URI string
 * @param {string} outputDir - Directory to save the file
 * @param {number} index - Number of the tab file
 * @returns {Promise<{filename: string, filepath: string}>}
 */
async function writeDataUriToFile(
  dataUri: string,
  outputDir: string,
  index: number
) {
  // Extract base64 data
  const base64Data = dataUri.split(",")[1];

  // Convert to buffer
  const imageBuffer = Buffer.from(base64Data, "base64");

  // Generate filename
  const filename = `${index}.png`;
  const filepath = join(outputDir, filename);

  // Write file
  await writeFile(filepath, imageBuffer);

  return { filename, filepath };
}

/**
 * Deletes an array of file paths
 * @param {string[]} filepaths - Array of file paths to delete
 */
async function cleanupFiles(filepaths: string[]) {
  const deletePromises = filepaths.map(async (filepath) => {
    try {
      await unlink(filepath);
    } catch (error) {
      console.warn(`Failed to delete ${filepath}:`, error.message);
    }
  });

  await Promise.all(deletePromises);
}

const findNextTabDir = async (basePath: string): Promise<string> => {
  let counter = 0;

  while (true) {
    const testPath = join(basePath, counter.toString());

    try {
      await access(testPath);
      counter++;
    } catch (error) {
      // If access() throws ENOENT, the directory doesn't exist
      if (error.code === "ENOENT") return counter.toString();

      // If it's a different error, re-throw it
      throw error;
    }
  }
};

export const addTablature = async (req: Request, res: Response) => {
  const db = await DB();

  const { songId } = req.params;
  const { uri, ...tab } = req.body as TablatureInput;

  const writtenFiles: string[] = [];

  try {
    if (!process.env.ASSETS) throw new Error("No ASSETS directory");

    if (songId && tab) {
      const validTabUris = uri.filter(
        (uri) => uri && typeof uri === "string" && uri.startsWith("data:image/")
      );

      if (validTabUris.length === 0)
        throw new Error("No valid data URIs provided");

      const basePath = join(process.env.ASSETS, songId, "tab");

      const tabId = await findNextTabDir(basePath);

      const outputDir = join(basePath, tabId);

      // Ensure directory exists
      await mkdir(outputDir, { recursive: true });

      // Small delay to ensure filesystem has processed the mkdir
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // TODO: Could use a retry-enabled version if a write fails.
      // Process all URIs with Promise.all for atomic operation
      const writePromises = validTabUris.map((uri, i) =>
        writeDataUriToFile(uri, outputDir, i)
      );

      // This will throw if any file fails to write
      const results = await Promise.all(writePromises);

      // Keep track of written files for potential cleanup
      writtenFiles.push(...results.map((result) => result.filepath));

      // With assets written to file, update the descriptor in the DB
      const songData = await db.collection<Song>("songs").findOneAndUpdate(
        { id: songId },
        {
          $push: {
            tablature: {
              ...tab,
              id: tabId,
              images: results.length,
              format: "ug2", // For now, I'm assuming all new tab being added is in the ug2 format.
            },
          },
        },
        { returnDocument: "after", projection: { _id: 0 } }
      );

      if (songData?.tablature) {
        res.send({
          error: false,
          scope: "song",
          type: "add",
          data: {
            song: songData,
          },
        });
      } else {
        throw "Song not updated";
      }
    } else {
      throw "Missing required params";
    }
  } catch (err) {
    console.log("ERROR", err);

    // If we have any written files and an error occurred, clean them up
    if (writtenFiles.length > 0) {
      console.log(`Cleaning up ${writtenFiles.length} files due to error...`);
      // await cleanupFiles(writtenFiles);
    }

    res.send({ error: true, scope: "song", type: "add" });
  }
};
