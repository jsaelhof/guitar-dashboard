import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
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
import { authorizedRoute } from "./utils/authorized-route.js";
import { login } from "./routes/login/login.js";
import { getExercise } from "./routes/exercise/:exerciseId/get-exercise.js";
import { getExercises } from "./routes/exercises/get-exercises.js";
import { updateExerciseSpeed } from "./routes/exercise/:exerciseId/update-exercise-speed.js";
import { searchSong } from "./routes/search/search-song.js";
import { insertSongs } from "./routes/songs/insert-songs.js";
import { updateStartOffsetSetting } from "./routes/song/:songId/update-start-offset-setting.js";
import { updateStartDelaySetting } from "./routes/song/:songId/update-start-delay-setting.js";
import { mount } from "./routes/util/mount.js";

dotenv.config();

// --- Set server ---
const app: Express = express();
const port = process.env.PORT;
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json({ limit: "100mb" }));
app.use(express.static("public"));
process.env.MP3_LIB && app.use(express.static(process.env.MP3_LIB));

// --- Setup Routes ---
// login
app.post("/login", login);

// /launch/*
app.post("/amp/on", ampOn);
app.post("/amp/off", ampOff);
app.post("/amp/status", ampStatus);

// /util/*
app.post("/util/mount", mount);

// /play/*
app.post("/play/:songId", playSong);

// /songs/*
app.get("/songs", authorizedRoute(getSongs));
app.post("/songs/recent", authorizedRoute(updateRecentSongs));
app.post("/songs/insert-songs", authorizedRoute(insertSongs));

// /song/*
app.get("/song/:songId", authorizedRoute(getSong));
app.post("/song/:songId/volume", authorizedRoute(updateVolumeSetting));
app.post("/song/:songId/pitch", authorizedRoute(updatePitchSetting));
app.post(
  "/song/:songId/startOffset",
  authorizedRoute(updateStartOffsetSetting)
);
app.post("/song/:songId/startDelay", authorizedRoute(updateStartDelaySetting));
app.post("/song/:songId/loop", authorizedRoute(insertLoop));
app.post("/song/:songId/updateloop", authorizedRoute(updateLoop));
app.post("/song/:songId/deleteloop", authorizedRoute(deleteLoop));
app.post("/song/:songId/addvideo", authorizedRoute(addVideo));
app.post("/song/:songId/deletevideo", authorizedRoute(deleteVideo));
app.post("/song/:songId/rifftime", authorizedRoute(updateRiffTime));
app.post("/song/:songId/addriff", authorizedRoute(addRiff));
app.post("/song/:songId/rifforder", authorizedRoute(updateRiffOrder));
app.post("/song/:songId/addtablature", authorizedRoute(addTablature));

// /exercise/*
app.get("/exercise/:exerciseId", authorizedRoute(getExercise));
app.post("/exercise/:exerciseId/speed", authorizedRoute(updateExerciseSpeed));

// /exercises/*
app.get("/exercises", authorizedRoute(getExercises));

// /search/*
app.post("/search-song", authorizedRoute(searchSong));

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
  console.log(`⚡️[server]: Server is running on port ${port}`);
});
