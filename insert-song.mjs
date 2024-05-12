import { readFileSync, writeFileSync } from "fs";

const DB = "./packages/server/db/db.json";

if (process.argv.length > 2) {
  const paths = process.argv[2].split(",");

  paths.forEach((path) => {
    if (path.startsWith("/Volumes/Public/Music/")) {
      const db = readFileSync(DB, {
        encoding: "utf-8",
      });
      const dbjson = JSON.parse(db);
      const lastKey = Object.keys(dbjson).at(-1);

      if (lastKey) {
        const nextKey = (parseInt(lastKey) + 1).toString().padStart(4, "0");
        dbjson[nextKey] = {
          file: path.replace("/Volumes/Public/Music/", ""),
        };

        writeFileSync(DB, JSON.stringify(dbjson, null, 2), "utf8");
      }
    } else {
      console.log("Only files from /Volumes/Public/Music/ are allowed");
    }
  });
} else {
  console.log("No file path");
}
