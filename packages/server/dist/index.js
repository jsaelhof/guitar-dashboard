import express from "express";
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
import { getRiffs } from "./routes/riffs/:songId/get-riffs.js";
import { updateRiffTime } from "./routes/riffs/:songId/update-riff-time.js";
import { addRiff } from "./routes/riffs/:songId/add-riff.js";
import { updateRiffOrder } from "./routes/riffs/:songId/update-riff-order.js";
import { getTablature } from "./routes/tab/:songId/get-tablature.js";
import { addTablature } from "./routes/tab/:songId/add-tablature.js";
import { addVideo } from "./routes/song/:songId/add-video.js";
import { deleteVideo } from "./routes/song/:songId/delete-video.js";
dotenv.config();
// --- Set server ---
const app = express();
const port = process.env.PORT;
app.use(cors({
    origin: "http://localhost:8000",
}));
app.use(express.json({ limit: "100mb" }));
app.use(express.static("public"));
app.use(express.static("/Volumes/Public/Music"));
// --- Setup Routes ---
// /play/*
app.post("/play/:songId", playSong);
// /songs/*
app.get("/songs", getSongs);
app.post("/songs/recent", updateRecentSongs);
// /song/*
app.get("/song/:songId", getSong);
app.post("/song/:songId/volume", updateVolumeSetting);
app.post("/song/:songId/loop", insertLoop);
app.post("/song/:songId/updateloop", updateLoop);
app.post("/song/:songId/deleteloop", deleteLoop);
app.post("/song/:songId/addvideo", addVideo);
app.post("/song/:songId/deletevideo", deleteVideo);
// /riffs/*
app.get("/riffs/:songId", getRiffs);
app.post("/riffs/:songId/time", updateRiffTime);
app.post("/riffs/:songId/add", addRiff);
app.post("/riffs/:songId/order", updateRiffOrder);
// /tab/*
app.get("/tab/:songId", getTablature);
app.post("/tab/:songId/add", addTablature);
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
