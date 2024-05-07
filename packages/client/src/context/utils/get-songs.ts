import { Song, Songs, SongsByArtist } from "../../types";
import { polyfillSong } from "./polyfill-song";

export const getSongs = async () => {
  const response = await fetch(`http://localhost:8001/songs`);
  const data: {
    [key: string]: Partial<Song>;
  } = await response.json();

  const { songs, songsByArtist } = Object.entries(data).reduce<{
    songs: Songs;
    songsByArtist: SongsByArtist;
  }>(
    (acc, [key, value]) => {
      const song = polyfillSong(key, value);
      acc.songs[key] = song;

      // While iterating all the songs, create an unsorted structure grouped by artist
      if (!acc.songsByArtist[song.artist]) acc.songsByArtist[song.artist] = [];
      acc.songsByArtist[song.artist].push(song);

      return acc;
    },
    {
      songs: {},
      songsByArtist: {},
    }
  );

  return {
    songs,

    // Sort by artist name, and within each artist, by song title
    songsByArtist: Object.keys(songsByArtist)
      .toSorted()
      .reduce<SongsByArtist>((acc, artist) => {
        acc[artist] = songsByArtist[artist].toSorted((a, b) =>
          a.title < b.title ? -1 : 1
        );
        return acc;
      }, {}),
  };
};
