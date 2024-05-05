import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { readFileSync, readdirSync } from "fs";
import path from "path";
import cors from "cors";
import db from "../public/db.json";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(
  cors({
    origin: "http://localhost:8000",
  })
);

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

app.post("/play/:slug", (req: Request, res: Response) => {
  const { file } = db[req.params.slug];

  var cp = require("child_process");
  cp.exec(`open -a "iina" "${file}"`, (error, stdout, stderr) => {
    console.log(error);
  });
  res.send({
    ok: true,
  });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
