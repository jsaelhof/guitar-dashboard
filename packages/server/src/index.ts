import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import cors from "cors";
import db from "../db/db.json";
import { polyfillSong } from "./utils/polyfill-song";
import { Songs, SongsByArtist } from "./types";
import { v4 as uuid } from "uuid";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(
  cors({
    origin: "http://localhost:8000",
  })
);

app.use(express.json({ limit: "100mb" }));

app.use(express.static("public"));
app.use(express.static("/Volumes/Public/Music"));

app.post("/play/:songId", (req: Request, res: Response) => {
  const { file } = db[req.params.songId];

  var cp = require("child_process");
  cp.exec(
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

app.get("/songs", (req: Request, res: Response) => {
  const recents = readFileSync("./db/recent.json", { encoding: "utf-8" });
  const recentSongIds: string[] = JSON.parse(recents);

  const songsByArtist = Object.entries(db as Songs).reduce<SongsByArtist>(
    (acc, [songId, data]) => {
      const song = polyfillSong(songId, data);

      // While iterating all the songs, create an unsorted structure grouped by artist
      if (!acc[song.artist]) acc[song.artist] = [];
      acc[song.artist].push({
        id: song.id,
        title: song.title,
      });

      return acc;
    },
    {}
  );

  res.send({
    error: false,
    scope: "songs",
    type: "init",
    data: {
      // Sort by artist name, and within each artist, by song title
      songsByArtist: Object.keys(songsByArtist)
        .toSorted()
        .reduce<SongsByArtist>((acc, artist) => {
          acc[artist] = songsByArtist[artist].toSorted((a, b) =>
            a.title < b.title ? -1 : 1
          );
          return acc;
        }, {}),

      recentSongs: recentSongIds.map((id) => {
        const { artist, title } = polyfillSong(id, db[id]);
        return {
          id,
          title,
          artist,
        };
      }),
    },
  });
});

app.post("/songs/recent", (req: Request, res: Response) => {
  const { songId } = req.body;

  const recents = readFileSync("./db/recent.json", { encoding: "utf-8" });

  const recentSongIds = [
    songId,
    ...JSON.parse(recents)
      .filter((id) => id !== songId)
      .slice(0, 30),
  ];

  writeFileSync(
    "./db/recent.json",
    JSON.stringify(recentSongIds, null, 2),
    "utf8"
  );

  res.send({
    error: false,
    scope: "recent",
    type: "add",
    data: {
      recentSongs: recentSongIds.map((id) => {
        const { artist, title } = polyfillSong(id, db[id]);
        return {
          id,
          title,
          artist,
        };
      }),
    },
  });
});

app.get("/song/:songId", (req: Request, res: Response) => {
  res.send({
    error: false,
    scope: "song",
    type: "init",
    data: {
      song: polyfillSong(req.params.songId, db[req.params.songId]),
    },
  });
});

app.post("/song/:songId/volume", (req: Request, res: Response) => {
  const { songId } = req.params;
  const volume = parseFloat(req.body.volume);

  if (songId && !isNaN(volume) && volume >= 0 && volume <= 1) {
    db[songId].settings = db[songId].settings ?? {};
    db[songId].settings.volume = volume;

    writeFileSync("./db/db.json", JSON.stringify(db, null, 2), "utf8");

    res.send({
      error: false,
      scope: "song",
      type: "volume",
      data: {
        song: polyfillSong(songId, db[songId]),
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

app.post("/song/:songId/loop", (req: Request, res: Response) => {
  const { songId } = req.params;
  const loopA = parseFloat(req.body.loopA);
  const loopB = parseFloat(req.body.loopB);
  const { label } = req.body;

  if (songId && loopA && loopB && label) {
    db[songId].loops = db[songId].loops ?? [];
    db[songId].loops.push({
      id: uuid(),
      loopA,
      loopB,
      label,
    });

    writeFileSync("./db/db.json", JSON.stringify(db, null, 2), "utf8");

    res.send({
      error: false,
      scope: "song",
      type: "loop",
      data: {
        song: polyfillSong(songId, db[songId]),
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

app.get("/riffs/:songId", (req: Request, res: Response) => {
  const { songId } = req.params;
  let /*riffImages,*/ riffUris;

  // TODO: Need to integrate actual image files with the riffs.json file so that order, time etc work.
  // try {
  //   riffImages = readdirSync(`public/assets/${songId}/riffs`).map((file) => {
  //     const [, label, ...labelDesc] = path.parse(file).name.split("_");
  //     return {
  //       label: label.split("-").join(" "),
  //       ...(labelDesc.length && {
  //         labelDesc: labelDesc.join(" "),
  //       }),
  //       src: `assets/${songId}/riffs/${file}`,
  //     };
  //   });
  // } catch (ex) {}

  try {
    riffUris = JSON.parse(
      readFileSync(`public/assets/${songId}/riffs.json`).toString()
    );
  } catch (ex) {}

  try {
    res.send({
      error: false,
      scope: "riffs",
      type: "init",
      data: {
        songId,
        riffs: [
          //...(riffImages ? riffImages : []),
          ...(riffUris ? riffUris : []),
        ],
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

app.post("/riffs/:songId/time", (req: Request, res: Response) => {
  const { songId } = req.params;
  const { riffId } = req.body;
  const seconds = parseInt(req.body.seconds);

  if (songId && !isNaN(seconds) && seconds >= 0 && riffId) {
    const riffFile = `./public/assets/${songId}/riffs.json`;
    if (existsSync(riffFile)) {
      const riffData = JSON.parse(
        readFileSync(riffFile, { encoding: "utf-8" })
      );
      const riffIndex = riffData.findIndex(({ id }) => id === riffId);
      riffData[riffIndex].time = seconds;
      writeFileSync(riffFile, JSON.stringify(riffData, null, 2), "utf8");

      res.send({
        error: false,
        scope: "riffs",
        type: "time",
        data: {
          songId,
          riffs: riffData,
        },
      });
    } else {
      res.send({ error: true, scope: "riffs", type: "time" });
    }
  } else {
    res.send({ error: true, scope: "riffs", type: "time" });
  }
});

app.post("/riffs/:songId/add", (req: Request, res: Response) => {
  const { songId } = req.params;
  const riff = req.body;

  try {
    const riffDir = `./public/assets/${songId}`;
    const riffFile = `${riffDir}/riffs.json`;

    let riffData = [];

    if (existsSync(riffFile)) {
      riffData = JSON.parse(readFileSync(riffFile, { encoding: "utf-8" }));
    } else if (!existsSync(riffDir)) {
      mkdirSync(riffDir);
    }

    riffData.push(riff);
    writeFileSync(riffFile, JSON.stringify(riffData, null, 2), "utf8");

    res.send({
      error: false,
      scope: "riffs",
      type: "add",
      data: {
        songId,
        riffs: riffData,
      },
    });
  } catch (ex) {
    res.send({ error: true, scope: "riffs", type: "add" });
  }
});

app.post("/riffs/:songId/order", (req: Request, res: Response) => {
  const { songId } = req.params;
  const { riffId, order } = req.body;

  try {
    const riffDir = `./public/assets/${songId}`;
    const riffFile = `${riffDir}/riffs.json`;

    let riffData = [];

    if (existsSync(riffFile)) {
      riffData = JSON.parse(readFileSync(riffFile, { encoding: "utf-8" }));
      const riff = riffData.find(({ id }) => riffId === id);
      const update = riffData
        .filter(({ id }) => riffId !== id)
        .toSpliced(order, 0, riff);
      writeFileSync(riffFile, JSON.stringify(update, null, 2), "utf8");

      res.send({
        error: false,
        scope: "riffs",
        type: "order",
        data: {
          songId,
          riffs: update,
        },
      });
    } else {
      res.send({ error: true, scope: "riffs", type: "order" });
    }
  } catch (ex) {
    res.send({ error: true, scope: "riffs", type: "order" });
  }
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
