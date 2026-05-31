import { Request, Response } from "express";
import DB from "../../../db/db.js";
import { Song, Tablature } from "guitar-dashboard-types";

export const updateTablature = async (
  // TODO: Strongly type the other express endpoints like this
  req: Request<
    { songId?: string },
    any,
    Pick<Tablature, "id" | "tuning" | "label" | "labelDesc">
  >,
  res: Response<
    | {
        error: false;
        scope: "song";
        type: "updateTablature";
        data: { song: Song };
      }
    | { error: true; scope: "song"; type: "updateTablature" }
  >, // TODO: Extract this to a type and udpate all the express endpoints,
) => {
  const db = await DB();

  const { songId } = req.params;
  const { id, ...data } = req.body;

  try {
    if (songId && id && data != null) {
      // Loop through the incoming updates and build the MongoDB dot-notation paths
      // TS only allows picked keys to be modified but technically anything could get through so we need to actually guard it.
      const setQuery = Object.entries(data).reduce<Record<string, any>>(
        (acc, [key, value]) => {
          if (["label", "labelDesc", "tuning"].includes(key)) {
            acc[`tablature.$[element].${key}`] = value;
          }
          return acc;
        },
        {},
      );

      // Now, run the update query using your dynamically built object
      const updatedSong = await db.collection<Song>("songs").findOneAndUpdate(
        {
          id: songId,
          // Ensures that a tablature array exists otherwise it returns a modified count of 0 which no changes.
          tablature: { $exists: true, $type: "array" },
        },
        { $set: setQuery },
        {
          arrayFilters: [{ "element.id": id }],
          returnDocument: "after",
        },
      );

      if (updatedSong) {
        res.send({
          error: false,
          scope: "song",
          type: "updateTablature",
          data: {
            song: updatedSong,
          },
        });
      } else {
        throw "Tablature was not updated";
      }
    } else {
      throw "Missing required params";
    }
  } catch (err) {
    res.send({ error: true, scope: "song", type: "updateTablature" });
  }
};
