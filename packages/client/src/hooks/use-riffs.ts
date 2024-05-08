import { useEffect, useState } from "react";
import { Riff } from "../types";

export const useRiffs = (songId?: string) => {
  const [riffs, setRiffs] = useState<Riff[] | null>(null);
  const [riffTimes, setRiffTimes] = useState<number[] | null>(null);

  useEffect(() => {
    if (songId) {
      const getRiffs = async (songId: string) => {
        const riffsData: Riff[] = await (
          await fetch(`http://localhost:8001/riffs/${songId}`)
        ).json();

        setRiffTimes(
          riffsData.reduce<number[] | null>((acc, riff) => {
            if (riff.time) {
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
  }, [songId]);

  return { riffs, riffTimes };
};
