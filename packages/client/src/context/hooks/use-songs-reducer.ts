import { useEffect, useReducer } from "react";
import { getSongs } from "../utils/get-songs";
import { Song, Songs, SongsByArtist } from "../../types";
import { updateServer } from "../../utils/update-server";

export type SongUpdateAction =
  | { type: "init"; songs: Songs; songsByArtist: SongsByArtist }
  | { id: string; type: "volume"; volume: number };

export type SongUpdateDispatch = (action: SongUpdateAction) => void;

const songsReducer = (
  state: { songs: Songs; songsByArtist: SongsByArtist },
  action: SongUpdateAction
) => {
  if (action.type === "init") {
    return {
      songs: action.songs,
      songsByArtist: action.songsByArtist,
    };
  }

  // Clone the song data
  const song: Song = structuredClone(state.songs[action.id]);

  // Update the song data optimistically and call the server to persist.
  // Currently there is no error handling if persisting fails.
  switch (action.type) {
    case "volume": {
      song.settings.volume = action.volume;
      updateServer(`set/${action.type}/${action.id}/${action.volume}`);
      break;
    }
  }

  // Insert the cloned song into the the sorted structure.
  // Avoid rebuilding the entire sorted structure and instead mutate the one song entry.
  const index = state.songsByArtist[song.artist].findIndex(
    ({ id }) => id === song.id
  );
  if (index >= 0) state.songsByArtist[song.artist][index] = song;

  return {
    songs: {
      ...state.songs,
      [song.id]: song,
    },
    songsByArtist: state.songsByArtist,
  };
};

export const useSongsReducer = () => {
  const [{ songs, songsByArtist }, dispatchSongUpdate] = useReducer(
    songsReducer,
    {
      songs: {},
      songsByArtist: {},
    }
  );

  // Initialize by downloading the song data and pushing it into the reducer.
  useEffect(() => {
    const loadSongs = async () => {
      const db = await getSongs();
      dispatchSongUpdate({
        type: "init",
        songs: db.songs,
        songsByArtist: db.songsByArtist,
      });
    };
    loadSongs();
  }, []);

  return { songs, songsByArtist, dispatchSongUpdate };
};
