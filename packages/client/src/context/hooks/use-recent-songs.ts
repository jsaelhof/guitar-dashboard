import { useCallback, useEffect, useState } from "react";
import { updateServer } from "../../utils/update-server";

export const useRecentSongs = () => {
  const [recentSongIds, setRecentSongIds] = useState<string[]>([]);

  const updateRecent = useCallback(async (recent: string[]) => {
    setRecentSongIds(recent);
  }, []);

  useEffect(() => {
    const getRecent = async () => {
      const { response } = await updateServer("recent");
      updateRecent(response.error ? [] : response.data.recentSongIds);
    };
    getRecent();
  }, []);

  return { recentSongIds, updateRecent };
};
