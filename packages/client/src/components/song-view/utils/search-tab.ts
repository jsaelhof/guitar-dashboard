import { Song } from "guitar-dashboard-types";

export const searchTab = (song: Song) =>
  song.title || song.artist
    ? window.open(
        `https://www.ultimate-guitar.com/search.php?search_type=title&value=${encodeURIComponent(
          `${song.title} ${song.artist}`
        )}`,
        "guitarTab"
      )
    : "https://www.ultimate-guitar.com";
