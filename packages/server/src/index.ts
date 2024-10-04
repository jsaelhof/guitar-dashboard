import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { polyfillSong } from "./utils/polyfill-song.js";
import { v4 as uuid } from "uuid";
import mongodb from "./db/db.js";
import childProcess from "child_process";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

const polyfillSongStages = [
  // For each song, apply the regex to the file path to create a field called "formFile" whose value is an array of [ artist, song title ].
  {
    $set: {
      fromFile: {
        $regexFind: {
          input: "$file",
          regex: /.*\/(.*)\/.*\/\d* - (.*)\.mp3$/,
        },
      },
    },
  },
  // For each song, set the artist and title fields conditionally. If they exist as direct fields, just use those. Otherwise use the values from the regex match.
  {
    $project: {
      _id: 0,
      id: 1,
      artist: {
        $cond: {
          if: "$artist",
          then: "$artist",
          else: { $arrayElemAt: ["$fromFile.captures", 0] }, // Need a nested condition to handle the captures not being found
        },
      },
      title: {
        $cond: {
          if: "$title",
          then: "$title",
          else: { $arrayElemAt: ["$fromFile.captures", 1] }, // Need a nested condition to handle the captures not being found
        },
      },
    },
  },
];

app.use(
  cors({
    origin: "http://localhost:8000",
  })
);

app.use(express.json({ limit: "100mb" }));

app.use(express.static("public"));
app.use(express.static("/Volumes/Public/Music"));

app.post("/play/:songId", async (req: Request, res: Response) => {
  const { songId } = req.params;

  // TODO: Handle songData = null;
  const songData = await mongodb
    .collection("songs")
    ?.findOne({ id: songId }, { projection: { file: 1 } });
  const { file } = songData;

  childProcess.exec(
    `open -a "iina" "/Volumes/Public/Music/${file}"`,
    (error, stdout, stderr) => {
      console.log(error);
    }
  );
  res.send({
    error: false,
    scope: "songs",
    type: "play",
  });
});

app.get("/songs", async (req: Request, res: Response) => {
  const recentSongs = await mongodb
    .collection("recentSongs")
    ?.aggregate([
      // For each id, find the matching document in the songs collection.
      // There will only be one match in the array set as the value of "as" which will be picked out by $first and used to replace the root.
      {
        $lookup: {
          from: "songs",
          localField: "id",
          foreignField: "id",
          pipeline: [{ $project: { id: 1, artist: 1, title: 1, file: 1 } }],
          as: "songs",
        },
      },
      { $sort: { id: -1 } },
      { $replaceRoot: { newRoot: { $first: "$songs" } } },
      ...polyfillSongStages,
    ])
    .toArray();

  // Execute the aggregation, send the returned cursor to an array and then reduce it.
  // This turns each { _id: <artist>, songs: [ "Song 1", "Song 2", ... ] } into { artist: ["Song 1", "Song 2", ...] }
  const songsByArtist = (
    await mongodb
      .collection("songs")
      ?.aggregate([
        ...polyfillSongStages,
        // Sort the songs alphabetically by title.
        { $sort: { title: 1 } },
        // Group all the songs by artist. The songs array will be sorted alphabetically b/c it respects the order of the sort in the previous stage.
        {
          $group: {
            _id: "$artist",
            songs: { $push: { id: "$id", title: "$title" } },
          },
        },
        // Now that the songs are grouped by artist, sort the list of artists alphabetically.
        { $sort: { _id: 1 } },
      ])
      .toArray()
  ).reduce((acc, { _id, songs }) => {
    acc[_id] = songs;
    return acc;
  }, {});

  res.send({
    error: false,
    scope: "songs",
    type: "init",
    data: {
      songsByArtist,
      recentSongs,
    },
  });
});

app.post("/songs/recent", async (req: Request, res: Response) => {
  const { songId } = req.body;

  await mongodb.collection("recentSongs")?.insertOne({ id: songId });

  // THIS IS COMPLETELY DUPLICATED FROM /songs
  const recentSongs = await mongodb
    .collection("recentSongs")
    ?.aggregate([
      // For each id, find the matching document in the songs collection.
      // There will only be one match in the array set as the value of "as" which will be picked out by $first and used to replace the root.
      {
        $lookup: {
          from: "songs",
          localField: "id",
          foreignField: "id",
          pipeline: [{ $project: { id: 1, artist: 1, title: 1, file: 1 } }],
          as: "songs",
        },
      },
      { $sort: { id: -1 } },
      { $replaceRoot: { newRoot: { $first: "$songs" } } },
      ...polyfillSongStages,
    ])
    .toArray();

  res.send({
    error: false,
    scope: "recent",
    type: "add",
    data: {
      recentSongs,
    },
  });
});

app.get("/song/:songId", async (req: Request, res: Response) => {
  const { songId } = req.params;

  const songData = await mongodb.collection("songs")?.findOne({ id: songId });

  if (songData) {
    res.send({
      error: false,
      scope: "song",
      type: "init",
      data: {
        song: polyfillSong(songId, songData), // TODO: I don't want to maintain a polyfill here AND in mongo aggregation. Same thing, different code. Pick one, or, migrate existing data and start doing the polyfill when a song is added.
      },
    });
  } else {
    res.send({
      error: true,
      scope: "song",
      type: "get",
    });
  }
});

app.post("/song/:songId/volume", async (req: Request, res: Response) => {
  const { songId } = req.params;
  const volume = parseFloat(req.body.volume);

  if (songId && !isNaN(volume) && volume >= 0 && volume <= 1) {
    // TODO: Handle songData = null;
    const songData = await mongodb
      .collection("songs")
      ?.findOneAndUpdate(
        { id: songId },
        { $set: { "settings.volume": volume } },
        { returnDocument: "after" }
      );

    res.send({
      error: false,
      scope: "song",
      type: "volume",
      data: {
        song: polyfillSong(songId, songData),
      },
    });
  } else {
    res.send({
      error: true,
      scope: "song",
      type: "volume",
    });
  }
});

app.post("/song/:songId/loop", async (req: Request, res: Response) => {
  const { songId } = req.params;
  const loopA = parseFloat(req.body.loopA);
  const loopB = parseFloat(req.body.loopB);
  const { label } = req.body;

  if (songId && loopA != null && loopB != null && label) {
    // TODO: Handle songData = null;
    const songData = await mongodb.collection("songs")?.findOneAndUpdate(
      { id: songId },
      {
        $push: {
          loops: {
            id: uuid(),
            loopA,
            loopB,
            label,
          },
        },
      },
      { returnDocument: "after" }
    );

    res.send({
      error: false,
      scope: "song",
      type: "loop",
      data: {
        song: polyfillSong(songId, songData),
      },
    });
  } else {
    res.send({
      error: true,
      scope: "song",
      type: "loop",
    });
  }
});

app.post("/song/:songId/updateloop", async (req: Request, res: Response) => {
  const { songId } = req.params;
  const loopA = parseFloat(req.body.loopA);
  const loopB = parseFloat(req.body.loopB);
  const { id, label } = req.body;

  if (songId && id && loopA != null && loopB != null && label) {
    // TODO: Handle songData = null;
    const songData = await mongodb.collection("songs")?.findOneAndUpdate(
      { id: songId, "loops.id": id },
      {
        $set: {
          "loops.$.label": label,
          "loops.$.loopA": loopA,
          "loops.$.loopB": loopB,
        },
      },
      { returnDocument: "after" }
    );

    res.send({
      error: false,
      scope: "song",
      type: "updateloop",
      data: {
        song: polyfillSong(songId, songData),
      },
    });
  } else {
    res.send({
      error: true,
      scope: "song",
      type: "loop",
    });
  }
});

app.post("/song/:songId/deleteloop", async (req: Request, res: Response) => {
  const { songId } = req.params;
  const { id } = req.body;

  if (songId && id) {
    // TODO: Handle songData = null;
    const songData = await mongodb.collection("songs")?.findOneAndUpdate(
      { id: songId },
      {
        $pull: {
          loops: {
            id,
          },
        },
      },
      { returnDocument: "after" }
    );

    res.send({
      error: false,
      scope: "song",
      type: "deleteloop",
      data: {
        song: polyfillSong(songId, songData),
      },
    });
  } else {
    res.send({
      error: true,
      scope: "song",
      type: "loop",
    });
  }
});

app.get("/riffs/:songId", async (req: Request, res: Response) => {
  const { songId } = req.params;

  const { riffs } = await mongodb
    .collection("songs")
    ?.findOne({ id: songId }, { projection: { _id: 0, riffs: 1 } });

  try {
    res.send({
      error: false,
      scope: "riffs",
      type: "init",
      data: {
        songId,
        riffs: riffs ?? [],
      },
    });
  } catch (ex) {
    res.send({
      error: true,
      scope: "riffs",
      type: "init",
    });
  }
});

app.post("/riffs/:songId/time", async (req: Request, res: Response) => {
  const { songId } = req.params;
  const { riffId } = req.body;
  const seconds = parseInt(req.body.seconds);

  if (songId && !isNaN(seconds) && seconds >= 0 && riffId) {
    // TODO: Handle songData = null;
    const { riffs } = await mongodb.collection("songs")?.findOneAndUpdate(
      { id: songId, "riffs.id": riffId },
      {
        $set: {
          "riffs.$.time": seconds,
        },
      },
      { returnDocument: "after", projection: { _id: 0, riffs: 1 } }
    );

    res.send({
      error: false,
      scope: "riffs",
      type: "time",
      data: {
        songId,
        riffs,
      },
    });
  } else {
    res.send({ error: true, scope: "riffs", type: "time" });
  }
});

app.post("/riffs/:songId/add", async (req: Request, res: Response) => {
  const { songId } = req.params;
  const riff = req.body;

  if (songId && riff) {
    const { riffs } = await mongodb.collection("songs")?.findOneAndUpdate(
      { id: songId },
      {
        $push: {
          riffs: riff,
        },
      },
      { returnDocument: "after", projection: { _id: 0, riffs: 1 } }
    );

    res.send({
      error: false,
      scope: "riffs",
      type: "add",
      data: {
        songId,
        riffs,
      },
    });
  } else {
    res.send({ error: true, scope: "riffs", type: "add" });
  }
});

app.post("/riffs/:songId/order", async (req: Request, res: Response) => {
  const { songId } = req.params;
  const { riffId, order } = req.body;

  if (songId && riffId && order != null) {
    // TODO: I think this might be able to be done in mongo directly with some combo of pull and push (using $each and $position) but I haven't figured out how to capture the pulled riff to use in the push.
    // This pull worked to remove an item: mongodb.collection("songs").findOneAndUpdate({ id: '0252' }, { $pull: { riffs: { id: "fc650b5b-f3cd-4b61-944a-891e9c725a26" } } })

    // Get all the riffs
    const { riffs } = await mongodb
      .collection("songs")
      ?.findOne({ id: songId }, { projection: { _id: 0, riffs: 1 } });

    // Find the riff being moved
    const riff = riffs.find(({ id }) => riffId === id);

    // Update the riffs array by removing the riff and then splicing it in.
    const update = (riffs ?? [])
      .filter(({ id }) => riffId !== id)
      .toSpliced(order, 0, riff);

    // Overwrite the whole array with the update.
    const { riffs: updatedRiffs } = await mongodb
      .collection("songs")
      ?.findOneAndUpdate(
        { id: songId },
        {
          $set: {
            riffs: update,
          },
        },
        { returnDocument: "after", projection: { _id: 0, riffs: 1 } }
      );

    res.send({
      error: false,
      scope: "riffs",
      type: "order",
      data: {
        songId,
        riffs: updatedRiffs,
      },
    });
  } else {
    res.send({ error: true, scope: "riffs", type: "order" });
  }
});

app.get("/tab/:songId", async (req: Request, res: Response) => {
  const { songId } = req.params;

  const { tablature } = await mongodb
    .collection("songs")
    ?.findOne({ id: songId }, { projection: { _id: 0, tablature: 1 } });

  try {
    res.send({
      error: false,
      scope: "tab",
      type: "init",
      data: {
        songId,
        tab: tablature ?? [],
      },
    });
  } catch (ex) {
    res.send({
      error: true,
      scope: "tab",
      type: "init",
    });
  }
});

app.post("/tab/:songId/add", async (req: Request, res: Response) => {
  const { songId } = req.params;
  const tab = req.body;

  if (songId && tab) {
    const { tablature } = await mongodb.collection("songs")?.findOneAndUpdate(
      { id: songId },
      {
        $push: {
          tablature: tab,
        },
      },
      { returnDocument: "after", projection: { _id: 0, tablature: 1 } }
    );

    res.send({
      error: false,
      scope: "tab",
      type: "add",
      data: {
        songId,
        tab: tablature,
      },
    });
  } else {
    res.send({ error: true, scope: "tab", type: "add" });
  }
});

/*
This route was an attempt to load UG in an iframe. It works for the first page but any link on that page then fails to connect the same way iframing the page directly does.

const fetchWebsite = (url: string) => {
  execSync(`curl -o site.html -L "${url}"`, (error, stdout, stderr) => {
    // execSync(`wget -q -O - ${url} > site.html`, (error, stdout, stderr) => {
    if (error !== null) {
      console.log(error);
      return false;
    }
  });
};

app.get("/search/ug", async (req, res) => {
  console.log("SEARCH UG");
  writeFileSync("site.html", "", () => console.log("Created site.html"));
  createReadStream("site.html").pipe(res);
  fetchWebsite(
    "https://www.ultimate-guitar.com/search.php?search_type=title&value=Black%20Diamond"
  );
});
*/

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
