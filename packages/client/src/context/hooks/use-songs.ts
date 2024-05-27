import { useActionState, useCallback, useEffect } from "react";
import { Song, Songs, SongsByArtist } from "../../types";
import { polyfillSong } from "../utils/polyfill-song";

type FetchSongsResponse = {
  data: { songsByArtist: SongsByArtist };
};
type UpdateSongResponse = { data: { [songId: string]: Song } };

export const useSongs = () => {
  // For my use case, this isn't working as well as it could.
  // useActionState _would_ work well, if any action submitted (input to getSongs func) returned the whole updated state.
  // Ideally I want to avoid that because its super inefficient.
  //
  // Idea 1: Instead of the load useEffect calling getSongs, just have it make a regular fetch and then pass that to useActionState as the initial state.
  // Then when updates are made (volume), the response can be just one song's data and the handler can splice it into the existing state.
  // Problem is that the useEffect probably has to wrap useActionState to feed it initial state.
  // - Or -, don't wrap it but have the handler insert any songs it gets back. If it gets the whole works then just update it which would allow an "get" that fetches everything.
  //
  // Idea 2: Look at how this is being used.
  // Maybe useSongs should be useSongsByArtist and get the sorted list of just names and id's and there should be a useSong (singular) hook that fetches the data for a song.
  // This could be maybe combined with useRiffs to pull together all the data into one spot for the single song.
  // So, separate the list of songs available from a single song's data.
  // This would make more sense for updating too since I only update the active song.

  const [{ songsByArtist, init }, getSongs, isPending] = useActionState<{
    init: boolean;
    songsByArtist: SongsByArtist;
  }>(
    async () => {
      const response = await fetch(`http://localhost:8001/songs`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { data } = (await response.json()) as FetchSongsResponse;

      return {
        init: true,
        ...data,
      };
    },
    {
      init: false,
      songsByArtist: {},
    }
  );

  const dispatch = useCallback(
    async (action: { type: "volume"; songId: string; volume: number }) => {
      await fetch(`http://localhost:8001/songs/${action.type}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(action),
      });

      // Refetch.
      // The "songs" scope responses return just the modified song which allows for a direct client-side update of state but that doesn't really fit the useActionState pattern.
      getSongs();
    },
    []
  );

  useEffect(() => getSongs(), []);

  return { songsReady: init, songsByArtist, dispatch };
};
