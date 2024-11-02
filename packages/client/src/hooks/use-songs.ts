import { useActionState, useEffect } from "react";
import { RecentSong, SongsByArtist } from "guitar-dashboard-types";

type FetchSongsResponse = {
  data: { songsByArtist: SongsByArtist; recentSongs: RecentSong[] };
};

export type SongsAction = { type: "recent"; songId: string } | { type: "get" };

export const useSongs = () => {
  const [{ songsByArtist, recentSongs }, dispatch, isPending] = useActionState<
    {
      songsByArtist: SongsByArtist;
      recentSongs: RecentSong[];
    },
    SongsAction
  >(
    async (prevState, { type, ...body }) => {
      const response = await fetch(
        `http://localhost:8001/songs${type !== "get" ? `/${type}` : ""}`,
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
