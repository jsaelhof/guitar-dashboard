import { useCallback, useEffect, useState } from "react";
import { updateServer } from "../../../utils/update-server";

export const useRecentSongs = (songId?: string) => {
  const [recentSongIds, setRecentSongIds] = useState<string[]>([]);

  const getRecent = useCallback(async () => {
    const response = await fetch(`http://localhost:8001/recent`);
    const data: string[] = await response.json();
    setRecentSongIds(data);
  }, []);

  useEffect(() => {
    getRecent();
  }, []);

  useEffect(() => {
    if (songId) {
      const timeoutId = setTimeout(async () => {
        await updateServer(`update-recent/${songId}`);
        await getRecent();
      }, 30000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [songId]);

  return recentSongIds;
};
