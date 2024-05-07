import { useEffect, useState } from "react";
import { Riff } from "../../../types";

export const useRiffs = (songId: string) => {
  const [riffs, setRiffs] = useState<Riff[] | null>(null);

  useEffect(() => {
    if (songId) {
      const getRiffs = async (songId: string) => {
        const riffsData = await (
          await fetch(`http://localhost:8001/riffs/${songId}`)
        ).json();
        setRiffs(riffsData);
      };

      getRiffs(songId);
    } else {
      setRiffs(null);
    }
  }, [songId]);

  return { riffs };
};
