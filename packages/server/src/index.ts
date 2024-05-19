import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "fs";
import path from "path";
import cors from "cors";
import db from "../db/db.json";

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

app.get("/songs", (req: Request, res: Response) => {
  res.send(db);
});

app.get("/riffs/:slug", (req: Request, res: Response) => {
  let riffImages, riffUris;

  try {
    riffImages = readdirSync(`public/assets/${req.params.slug}/riffs`).map(
      (file) => {
        const [, label, ...labelDesc] = path.parse(file).name.split("_");
        return {
          label: label.split("-").join(" "),
          ...(labelDesc.length && {
            labelDesc: labelDesc.join(" "),
          }),
          src: `assets/${req.params.slug}/riffs/${file}`,
        };
      }
    );
  } catch (ex) {}

  try {
    riffUris = JSON.parse(
      readFileSync(`public/assets/${req.params.slug}/riffs.json`).toString()
    );
  } catch (ex) {}

  try {
    res.send([
      ...(riffImages ? riffImages : []),
      ...(riffUris ? riffUris : []),
    ]);
  } catch (ex) {
    console.error(ex);
    res.send([]);
  }
});

app.get("/recent", (req: Request, res: Response) => {
  const recents = readFileSync("./db/recent.json", { encoding: "utf-8" });
  const recentsJson: string[] = JSON.parse(recents);
  res.send(recentsJson);
});

app.post("/update-recent/:songId", (req: Request, res: Response) => {
  const { songId } = req.params;

  const recents = readFileSync("./db/recent.json", { encoding: "utf-8" });

  writeFileSync(
    "./db/recent.json",
    JSON.stringify(
      [
        songId,
        ...JSON.parse(recents)
          .filter((id) => id !== songId)
          .slice(0, 30),
      ],
      null,
      2
    ),
    "utf8"
  );

  res.send({
    songId,
  });
});

app.post("/play/:slug", (req: Request, res: Response) => {
  const { file } = db[req.params.slug];

  var cp = require("child_process");
  cp.exec(`open -a "iina" "${file}"`, (error, stdout, stderr) => {
    console.log(error);
  });
  res.send({});
});

app.post("/set/volume/:songId/:volume", (req: Request, res: Response) => {
  const songId = req.params.songId;
  const volume = parseFloat(req.params.volume);

  if (songId && !isNaN(volume) && volume >= 0 && volume <= 1) {
    db[songId].settings = db[songId].settings ?? {};
    db[songId].settings.volume = volume;

    writeFileSync("./db/db.json", JSON.stringify(db, null, 2), "utf8");

    res.send({
      data: {
        volume,
      },
    });
  } else {
    res.send({
      error: true,
    });
  }
});

app.post(
  "/set/rifftime/:songId/:riffId/:seconds",
  (req: Request, res: Response) => {
    const songId = req.params.songId;
    const seconds = parseInt(req.params.seconds);
    const riffId = req.params.riffId;

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
          data: {
            songId,
            riffId,
            seconds,
          },
        });
      } else {
        res.send({
          error: true,
        });
      }
    } else {
      res.send({
        error: true,
      });
    }
  }
);

app.post("/set/riffsection/:songId", (req: Request, res: Response) => {
  const songId = req.params.songId;

  if (songId) {
    try {
      const riffDir = `./public/assets/${songId}`;
      const riffFile = `${riffDir}/riffs.json`;

      let riffData = [];

      if (existsSync(riffFile)) {
        riffData = JSON.parse(readFileSync(riffFile, { encoding: "utf-8" }));
      } else if (!existsSync(riffDir)) {
        mkdirSync(riffDir);
      }

      riffData.push(req.body);
      writeFileSync(riffFile, JSON.stringify(riffData, null, 2), "utf8");

      res.send({
        data: {
          songId,
        },
      });
    } catch (ex) {
      res.send({
        error: true,
      });
    }
  } else {
    res.send({
      error: true,
    });
  }
});

app.post("/riff/:songId/:riffId/:order", (req: Request, res: Response) => {
  const { songId, riffId, order } = req.params;

  if (songId) {
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
          data: {
            songId,
            riffId,
            order,
          },
        });
      } else {
        res.send({ error: true });
      }
    } catch (ex) {
      res.send({
        error: true,
      });
    }
  } else {
    res.send({
      error: true,
    });
  }
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
