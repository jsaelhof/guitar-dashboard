import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { getSongs } from "./routes/songs/get-songs.js";
import { updateRecentSongs } from "./routes/songs/update-recent-songs.js";
import { playSong as playSong } from "./routes/play/:songId/play-song.js";
import { getSong } from "./routes/song/:songId/get-song.js";
import { updateVolumeSetting } from "./routes/song/:songId/update-volume-setting.js";
import { insertLoop } from "./routes/song/:songId/insert-loop.js";
import { updateLoop } from "./routes/song/:songId/update-loop.js";
import { deleteLoop } from "./routes/song/:songId/delete-loop.js";
import { updateRiffTime } from "./routes/song/:songId/update-riff-time.js";
import { addRiff } from "./routes/song/:songId/add-riff.js";
import { updateRiffOrder } from "./routes/song/:songId/update-riff-order.js";
import { addTablature } from "./routes/song/:songId/add-tablature.js";
import { addVideo } from "./routes/song/:songId/add-video.js";
import { deleteVideo } from "./routes/song/:songId/delete-video.js";
import { updatePitchSetting } from "./routes/song/:songId/update-pitch-setting.js";
import { ampOn } from "./routes/launch/amp-on.js";
import { ampOff } from "./routes/launch/amp-off.js";
import { ampStatus } from "./routes/launch/amp-status.js";

dotenv.config();

// --- Set server ---
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

// --- Setup Routes ---
// /launch/*
app.post("/amp/on", ampOn);
app.post("/amp/off", ampOff);
app.post("/amp/status", ampStatus);

// /play/*
app.post("/play/:songId", playSong);

// /songs/*
app.get("/songs", getSongs);
app.post("/songs/recent", updateRecentSongs);

// /song/*
app.get("/song/:songId", getSong);
app.post("/song/:songId/volume", updateVolumeSetting);
app.post("/song/:songId/pitch", updatePitchSetting);
app.post("/song/:songId/loop", insertLoop);
app.post("/song/:songId/updateloop", updateLoop);
app.post("/song/:songId/deleteloop", deleteLoop);
app.post("/song/:songId/addvideo", addVideo);
app.post("/song/:songId/deletevideo", deleteVideo);
app.post("/song/:songId/rifftime", updateRiffTime);
app.post("/song/:songId/addriff", addRiff);
app.post("/song/:songId/rifforder", updateRiffOrder);
app.post("/song/:songId/addtablature", addTablature);

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

// --- Start server ---
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
