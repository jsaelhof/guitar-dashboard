import { useActionState, useEffect } from "react";
import { Song } from "../../types";

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
  >(async (_, { type, ...body }) => {
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

    return data.song;
  }, undefined);

  useEffect(() => {
    dispatch({ type: "get" });
  }, [songId]);

  return { song, dispatch };
};
