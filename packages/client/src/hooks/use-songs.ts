import { useEffect, useState } from "react";
import { Song, SongDict, SongsByArtist } from "../types";
import { polyfillSong } from "../utils/polyfill-song";

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
            const song = polyfillSong(key, value);
            acc.songs[key] = song;

            // While iterating all the songs, create an unsorted structure grouped by artist
            if (!acc.songsByArtist[song.artist])
              acc.songsByArtist[song.artist] = [];
            acc.songsByArtist[song.artist].push(song);

            return acc;
          },
          {
            songs: {},
            songsByArtist: {},
          }
        );

        // Sort by artist name, and within each artist, by song title
        const sortedbyArtist = Object.keys(songDB.songsByArtist)
          .toSorted()
          .reduce<SongsByArtist>((acc, artist) => {
            acc[artist] = songDB.songsByArtist[artist].toSorted((a, b) =>
              a.title < b.title ? -1 : 1
            );
            return acc;
          }, {});

        setSongs(songDB.songs);
        setSongsByArtist(sortedbyArtist);
      };

      getSongs();
    }
  }, [songs]);

  return { songs, songsByArtist };
};
