import { useActionState, useEffect } from "react";
import { RecentSong, SongsByArtist } from "guitar-dashboard-types";
import { useNavigate } from "react-router-dom";
import { post } from "../utils/post";
import { get } from "../utils/get";

type FetchSongsResponse = {
  data: { songsByArtist: SongsByArtist; recentSongs: RecentSong[] };
};

export type SongsAction = { type: "recent"; songId: string } | { type: "get" };

export const useSongs = () => {
  const navigate = useNavigate();

  const [{ songsByArtist, recentSongs }, dispatch, isPending] = useActionState<
    {
      songsByArtist: SongsByArtist;
      recentSongs: RecentSong[];
    },
    SongsAction
  >(
    async (prevState, { type, ...body }) => {
      const response =
        type === "get"
          ? await get("/songs")
          : await post(`/songs/${type}`, JSON.stringify(body));

      if (response.status === 401) {
        navigate("/login");
        return {
          songsByArtist: {},
          recentSongs: [],
        };
      }

      const { data } = (await response.json()) as FetchSongsResponse;

      return {
        ...prevState,
        ...data,
      };
    },
    {
      songsByArtist: {},
      recentSongs: [],
    }
  );

  useEffect(() => dispatch({ type: "get" }), []);

  return { songsByArtist, recentSongs, dispatch };
};
