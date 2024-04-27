import { useEffect, useState } from "react";
import { Song, SongDict, SongsByArtist } from "../types";

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

export const useSongs = () => {
  const [songs, setSongs] = useState<SongDict | null>(null);
  const [songsByArtist, setSongsByArtist] = useState<SongsByArtist | null>(
    null
  );

  useEffect(() => {
    if (!songs) {
      const getSongs = async () => {
        const response = await fetch(`http://localhost:8001/songs`);
        const data: {
          [key: string]: Partial<Song>;
        } = await response.json();

        const songDB = Object.entries(data).reduce<{
          songs: SongDict;
          songsByArtist: SongsByArtist;
        }>(
          (acc, [key, value]) => {
            // Find the artist from the data or by extracting it from the file naming pattern of my mp3's
            const artist =
              value.artist ??
              getSongInfoFromFilePath(value.file)?.artist ??
              "Unknown";

            // Find the title from the data or the file naming pattern of my mp3's
            const title =
              value.title ?? getSongInfoFromFilePath(value.file)?.title ?? key;

            const song: Song = {
              ...value,
              id: key,
              title,
              artist,
              // Use the tab from the data but if not available, do a search by title first, then fallback to artist and then fallback to the homepage of ultimate guitar.
              tab:
                value.tab ??
                (title || artist
                  ? `https://www.ultimate-guitar.com/search.php?search_type=title&value=${encodeURIComponent(
                      title ?? artist ?? ""
                    )}`
                  : "https://www.ultimate-guitar.com"),
            };

            acc.songs[key] = song;

            if (!acc.songsByArtist[song.artist])
              acc.songsByArtist[song.artist] = [];
            acc.songsByArtist[song.artist].push(song);

            // FIXME: Not very efficient to be sorting as each song is added.
            acc.songsByArtist[song.artist].sort((a, b) =>
              a.title < b.title ? -1 : 1
            );
            return acc;
          },
          {
            songs: {},
            songsByArtist: {},
          }
        );

        setSongs(songDB.songs);
        setSongsByArtist(songDB.songsByArtist);
      };

      getSongs();
    }
  }, [songs]);

  return { songs, songsByArtist };
};
