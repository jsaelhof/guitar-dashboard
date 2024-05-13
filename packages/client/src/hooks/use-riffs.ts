import { useCallback, useEffect, useState } from "react";
import { Riff } from "../types";

export const useRiffs = (songId?: string) => {
  const [riffs, setRiffs] = useState<Riff[] | null>(null);
  const [riffTimes, setRiffTimes] = useState<number[] | null>(null);

  const [refreshToken, setRefreshToken] = useState<number>(0);
  const refreshRiffs = useCallback(() => setRefreshToken(refreshToken + 1), []);

  useEffect(() => {
    if (songId) {
      // When the song changes, clear any riffs.
      setRiffs(null);
      setRiffTimes(null);

      const getRiffs = async (songId: string) => {
        const data: Riff[] = await (
          await fetch(`http://localhost:8001/riffs/${songId}`)
        ).json();

        // If this riff clones another, find it and overlay this data over the cloned data.
        // This allows a riff to clone another one and just change the label/time
        const riffsData: Riff[] = data.map((riff) =>
          riff.clones
            ? { ...data.find(({ id }) => riff.clones === id), ...riff }
            : riff
        );

        setRiffTimes(
          riffsData.reduce<number[] | null>((acc, riff) => {
            if (riff.time !== undefined) {
              if (!acc) acc = [];
              acc.push(riff.time);
            }
            return acc;
          }, null)
        );

        setRiffs(riffsData);
      };

      getRiffs(songId);
    } else {
      setRiffs(null);
    }
  }, [songId, refreshToken]);

  return { riffs, riffTimes, refreshRiffs };
};
