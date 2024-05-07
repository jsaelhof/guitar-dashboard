import { Song } from "../../types";

const getSongInfoFromFilePath = (path?: string) => {
  if (!path) return null;

  const result = path.match(/.*\/(.*)\/.*\/\d* - (.*)\.mp3$/);
  return result?.length === 3
    ? {
        artist: result[1],
        title: result[2],
      }
    : null;
};

export const polyfillSong = (id: string, song: Partial<Song>): Song => {
  // Find the artist from the data or by extracting it from the file naming pattern of my mp3's
  const artist =
    song.artist ?? getSongInfoFromFilePath(song.file)?.artist ?? "Unknown";

  // Find the title from the data or the file naming pattern of my mp3's
  const title = song.title ?? getSongInfoFromFilePath(song.file)?.title ?? id;

  return {
    ...song,
    id,
    title,
    artist,
    // Use the tab from the data but if not available, do a search by title first, then fallback to artist and then fallback to the homepage of ultimate guitar.
    tab:
      song.tab ??
      (title || artist
        ? `https://www.ultimate-guitar.com/search.php?search_type=title&value=${encodeURIComponent(
            title ?? artist ?? ""
          )}`
        : "https://www.ultimate-guitar.com"),
    settings: {
      volume: song.settings?.volume ? song.settings.volume : 0.5,
    },
  };
};
