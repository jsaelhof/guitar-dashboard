import { useEffect, useReducer } from "react";
import { updateServer } from "../../utils/update-server";

export type RecentSongsUpdateAction =
  | { type: "init"; recentSongIds: string[] }
  | { type: "add"; songId: string };

export type RecentSongsUpdateDispatch = (
  action: RecentSongsUpdateAction
) => void;

const recentSongsReducer = (
  state: { recentSongIds: string[] },
  action: RecentSongsUpdateAction
) => {
  // Update the recent song data optimistically and call the server to persist.
  // Currently there is no error handling if persisting fails.
  switch (action.type) {
    case "init":
      return { recentSongIds: action.recentSongIds };
    case "add":
      updateServer(`update-recent/${action.songId}`);
      return {
        recentSongIds: [
          action.songId,
          ...state.recentSongIds
            .filter((songId) => songId !== action.songId)
            .slice(0, 30),
        ],
      };
  }
};

export const useRecentSongsReducer = () => {
  const [state, dispatchRecentSongsUpdate] = useReducer(recentSongsReducer, {
    recentSongIds: [],
  });

  useEffect(() => {
    const getRecent = async () => {
      const response = await fetch(`http://localhost:8001/recent`);
      const data: string[] = await response.json();
      dispatchRecentSongsUpdate({ type: "init", recentSongIds: data });
    };

    getRecent();
  }, []);

  return { recentSongIds: state.recentSongIds, dispatchRecentSongsUpdate };
};
