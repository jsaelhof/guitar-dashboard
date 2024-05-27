import { useActionState, useCallback, useEffect } from "react";
import { Song } from "../../types";

type FetchSongResponse = {
  data: { song: Song };
};

// TODO: This whole hook could potentially be combined with riffs, even if they keep separate data on the BE.
// This could easily fetch twice or have the BE pull together the two sources into one response.
export const useSong = (songId: string) => {
  const [song, getSong, isPending] = useActionState<Song | undefined, string>(
    async (_, songId) => {
      const response = await fetch(`http://localhost:8001/song/${songId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { data } = (await response.json()) as FetchSongResponse;

      return data.song;
    },
    undefined
  );

  const dispatch = useCallback(
    async (action: { type: "volume"; songId: string; volume: number }) => {
      await fetch(
        `http://localhost:8001/song/${action.songId}/${action.type}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(action),
        }
      );

      // Refetch.
      getSong(action.songId);
    },
    []
  );

  useEffect(() => getSong(songId), [songId]);

  return { song, dispatch };
};
