import { useCallback, useEffect, useState } from "react";
import { Songs, SongsByArtist } from "../../types";
import { updateServer } from "../../utils/update-server";
import { polyfillSong } from "../utils/polyfill-song";

export const useSongs = () => {
  const [songs, setSongs] = useState<Songs>({});
  const [songsByArtist, setSongsByArtist] = useState<SongsByArtist>({});

  const updateSongs = useCallback((data: Songs) => {
    const { songs, songsByArtist } = Object.entries(data).reduce<{
      songs: Songs;
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

    setSongs(songs);

    // Sort by artist name, and within each artist, by song title
    setSongsByArtist(
      Object.keys(songsByArtist)
        .toSorted()
        .reduce<SongsByArtist>((acc, artist) => {
          acc[artist] = songsByArtist[artist].toSorted((a, b) =>
            a.title < b.title ? -1 : 1
          );
          return acc;
        }, {})
    );
  }, []);

  useEffect(() => {
    const getSongs = async () => {
      const { response } = await updateServer("songs");
      const data: Songs = response.data.songs;
      updateSongs(data);
    };

    getSongs();
  }, []);

  return { songs, songsByArtist, updateSongs };
};
