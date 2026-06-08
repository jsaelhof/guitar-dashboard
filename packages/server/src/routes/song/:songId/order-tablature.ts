import { Request, Response } from "express";
import DB from "../../../db/db.js";
import { Song } from "guitar-dashboard-types";

export const orderTablature = async (req: Request, res: Response) => {
  const db = await DB();

  const { songId } = req.params;
  const { id, order } = req.body;

  try {
    if (songId && id && order != null) {
      // TODO: I think this might be able to be done in mongo directly with some combo of pull and push (using $each and $position) but I haven't figured out how to capture the pulled tablature to use in the push.
      // This pull worked to remove an item: mongodb.collection("songs").findOneAndUpdate({ id: '0252' }, { $pull: { tablature: { id: "fc650b5b-f3cd-4b61-944a-891e9c725a26" } } })

      const songData = await db
        .collection<Song>("songs")
        .findOne({ id: songId }, { projection: { _id: 0, tablature: 1 } });

      if (songData?.tablature) {
        // Find the tablature being moved
        const tablature = songData.tablature.find(
          (tablature) => tablature.id === id,
        );

        if (tablature) {
          // Update the tablature array by removing the tablature and then splicing it in.
          const update = songData.tablature
            .filter((tablature) => tablature.id !== id)
            .toSpliced(order, 0, tablature);

          // Overwrite the whole array with the update.
          const updatedSong = await db
            .collection<Song>("songs")
            .findOneAndUpdate(
              { id: songId },
              {
                $set: {
                  tablature: update,
                },
              },
              { returnDocument: "after", projection: { _id: 0 } },
            );

          if (updatedSong?.tablature) {
            res.send({
              error: false,
              scope: "song",
              type: "orderTablature",
              data: {
                song: updatedSong,
              },
            });
          } else {
            throw "Update contains no tablature";
          }
        } else {
          throw "Tablature not found in song";
        }
      } else {
        throw "No tablature found";
      }
    } else {
      throw "Missing required params";
    }
  } catch (err) {
    res.send({ error: true, scope: "song", type: "orderTablature" });
  }
};
