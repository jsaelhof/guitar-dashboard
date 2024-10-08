import { MongoClient } from "mongodb";

const connectionString = "mongodb://localhost:27017/guitar";
const client = new MongoClient(connectionString);

let conn;
let db;

try {
  conn = await client.connect();
  db = conn.db("guitar");
} catch (e) {
  console.error(e);
}

const getSongInfoFromFilePath = (path) => {
  if (!path) return null;

  const result = path.match(/.*\/(.*)\/.*\/\d* - (.*)\.mp3$/);
  return result?.length === 3
    ? {
        artist: result[1],
        title: result[2],
      }
    : null;
};

const polyfillSong = (id, file) => {
  // Find the artist from the data or by extracting it from the file naming pattern of my mp3's
  const artist = getSongInfoFromFilePath(file)?.artist ?? "Unknown";

  // Find the title from the data or the file naming pattern of my mp3's
  const title = getSongInfoFromFilePath(file)?.title ?? id;

  return {
    id,
    file,
    artist,
    settings: {
      volume: 0.5,
    },
    title,
  };
};

if (process.argv.length > 2) {
  const paths = process.argv
    .slice(2)
    .map((s) => s.split(","))
    .flat();

  for (const path of paths) {
    if (path.startsWith("/Volumes/Public/Music/")) {
      const lastDoc = await db
        ?.collection("songs")
        ?.find({}, { projection: { _id: 0, id: 1 } })
        .sort({ id: -1 })
        .limit(1)
        .next();

      if (lastDoc) {
        const nextKey = (parseInt(lastDoc.id) + 1).toString().padStart(4, "0");

        const result = await db
          ?.collection("songs")
          .insertOne(
            polyfillSong(nextKey, path.replace("/Volumes/Public/Music/", ""))
          );

        if (!result) {
          console.log("An error occurred processing " + path);
        } else {
          console.log("Success: " + result.insertedId);
        }
      }
    } else {
      console.log("Only files from /Volumes/Public/Music/ are allowed");
    }
  }
} else {
  console.log("No file path");
}

process.exit(0);
