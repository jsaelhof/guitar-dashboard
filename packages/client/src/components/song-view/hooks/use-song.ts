import { useActionState, useEffect } from "react";
import { debounce } from "@mui/material";
import deepmerge from "deepmerge";
import { Song, Tablature } from "guitar-dashboard-types";
import { useNavigate } from "react-router-dom";
import { post } from "../../../utils/post";
import { get } from "../../../utils/get";

type FetchSongResponse = {
  data: { song: Song };
};

export type SongAction =
  | { type: "get" }
  | { type: "volume"; volume: number }
  | { type: "pitch"; pitch: number }
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
  | {
      type: "addriff";
      id: string;
      label: string;
      labelDesc?: string;
      uri: string[];
    }
  | {
      type: "rifftime";
      riffId: string;
      seconds: number;
    }
  | {
      type: "rifforder";
      riffId: string;
      order: number;
    }
  | ({
      type: "addtablature";
    } & Tablature);

export const useSong = (songId?: string) => {
  const navigate = useNavigate();

  const [song, dispatch, isPending] = useActionState<
    Song | undefined,
    SongAction
  >(async (currentState, { type, ...body }) => {
    const response =
      type === "get"
        ? await get(`/song/${songId}`)
        : await post(`/song/${songId}/${type}`, JSON.stringify(body));

    if (response.status === 401) {
      navigate("/login");
      return;
    }

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
