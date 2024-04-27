import { useEffect, useState } from "react";
import { Riff } from "../types";
import { useParams } from "react-router-dom";

export const useRiffs = () => {
  const { songId } = useParams();
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

  return riffs;
};
