import { useActionState, useEffect } from "react";
import { Song } from "../../types";
import { debounce } from "@mui/material";
import deepmerge from "deepmerge";

type FetchSongResponse = {
  data: { song: Song };
};
// TODO: This whole hook could potentially be combined with riffs, even if they keep separate data on the BE.
// This could easily fetch twice or have the BE pull together the two sources into one response.
export const useSong = (songId?: string) => {
  const [song, dispatch, isPending] = useActionState<
    Song | undefined,
    | { type: "get" }
    | { type: "volume"; volume: number }
    | { type: "loop"; loopA: number; loopB: number; label: string }
    | {
        type: "updateloop";
        id: string;
        loopA: number;
        loopB: number;
        label: string;
      }
    | { type: "deleteloop"; id: string }
    | { type: "addvideo"; url: string; desc: string }
    | { type: "deletevideo"; id: string }
  >(async (currentState, { type, ...body }) => {
    const response = await fetch(
      `http://localhost:8001/song/${songId}${type !== "get" ? `/${type}` : ""}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        ...(type !== "get" && {
          method: "POST",
          body: JSON.stringify(body),
        }),
      }
    );
    const { data } = (await response.json()) as FetchSongResponse;

    // Return the current state, overlayed with the newest data.
    // I'm doing this because the cover is only returned on the get action the first time.
    // Later requests to update the song in the BE return data without it.
    // When the song changes, ignore any existing state.
    // TODO: I could make the BE start returning less data on updates (i.e. just the new volume setting) now that I am doing this.
    return currentState?.id === data.song.id
      ? deepmerge(currentState, data.song, {
          // This tells deepmerge how to merge two arrays. Currently, I'm always overwriting the old array (i.e. the loops etc) with the new one.
          arrayMerge: (target, source, options) => source,
        })
      : data.song;
  }, undefined);

  useEffect(() => {
    dispatch({ type: "get" });
  }, [songId]);

  // Debounce the dispatch function.
  // In case like rapidly changing the volume, this prevents overlaping fetches that cause the page to crash.
  return { song, dispatch: debounce(dispatch), isPending };
};
