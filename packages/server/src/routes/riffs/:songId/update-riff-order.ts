import { Request, Response } from "express";
import DB from "../../../db/db.js";
import { Song } from "guitar-dashboard-types";

export const updateRiffOrder = async (req: Request, res: Response) => {
  const db = await DB();

  const { songId } = req.params;
  const { riffId, order } = req.body;

  try {
    if (songId && riffId && order != null) {
      // TODO: I think this might be able to be done in mongo directly with some combo of pull and push (using $each and $position) but I haven't figured out how to capture the pulled riff to use in the push.
      // This pull worked to remove an item: mongodb.collection("songs").findOneAndUpdate({ id: '0252' }, { $pull: { riffs: { id: "fc650b5b-f3cd-4b61-944a-891e9c725a26" } } })

      const songData = await db
        .collection<Song>("songs")
        .findOne({ id: songId }, { projection: { _id: 0, riffs: 1 } });

      if (songData?.riffs) {
        // Find the riff being moved
        const riff = songData.riffs.find(({ id }) => riffId === id);

        if (riff) {
          // Update the riffs array by removing the riff and then splicing it in.
          const update = songData.riffs
            .filter(({ id }) => riffId !== id)
            .toSpliced(order, 0, riff);

          // Overwrite the whole array with the update.
          const updatedSong = await db
            .collection<Song>("songs")
            .findOneAndUpdate(
              { id: songId },
              {
                $set: {
                  riffs: update,
                },
              },
              { returnDocument: "after", projection: { _id: 0, riffs: 1 } }
            );

          if (updatedSong?.riffs) {
            res.send({
              error: false,
              scope: "riffs",
              type: "order",
              data: {
                songId,
                riffs: updatedSong.riffs,
              },
            });
          } else {
            throw "Update contains no riffs";
          }
        } else {
          throw "Riff not found in song";
        }
      } else {
        throw "No riffs found";
      }
    } else {
      throw "Missing required params";
    }
  } catch (err) {
    res.send({ error: true, scope: "riffs", type: "order" });
  }
};
