import { useCallback, useEffect, useState } from "react";

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
        await fetch(`http://localhost:8001/update-recent/${songId}`, {
          method: "POST",
        });

        await getRecent();
      }, 30000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [songId]);

  return recentSongIds;
};
