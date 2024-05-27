import { useActionState, useCallback, useEffect } from "react";
import { RecentSong } from "../../types";

type FetchRecentSongsResponse = { data: { recentSongs: RecentSong[] } };

export const useRecentSongs = () => {
  const [{ recentSongs }, getRecentSongs, isPending] = useActionState<
    FetchRecentSongsResponse["data"]
  >(
    async () => {
      const response = await fetch(`http://localhost:8001/recent`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { data } = (await response.json()) as FetchRecentSongsResponse;

      return data;
    },
    {
      recentSongs: [],
    }
  );

  const dispatch = useCallback(
    async (action: { type: "add"; songId: string }) => {
      await fetch(`http://localhost:8001/recent/${action.type}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(action),
      });

      // Refetch.
      getRecentSongs();
    },
    []
  );

  useEffect(() => getRecentSongs(), []);

  return { recentSongs, dispatch };
};
