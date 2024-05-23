import { useCallback, useEffect, useState } from "react";
import { Riff } from "../../types";
import { updateServer } from "../../utils/update-server";

const buildRiffTimes = (riffsData: Riff[]) =>
  riffsData.reduce<number[] | null>((acc, riff) => {
    if (riff.time !== undefined) {
      if (!acc) acc = [];
      acc.push(riff.time);
    }
    return acc;
  }, null);

export const useRiffs = (songId: string) => {
  const [riffs, setRiffs] = useState<Riff[]>([]);
  const [riffTimes, setRiffTimes] = useState<number[] | null>(null);

  const updateRiffs = useCallback((data: Riff[]) => {
    // If this riff clones another, find it and overlay this data over the cloned data.
    // This allows a riff to clone another one and just change the label/time
    const processedRiffData = data.map((riff) =>
      riff.clones
        ? { ...data.find(({ id }) => riff.clones === id), ...riff }
        : riff
    );

    setRiffs(processedRiffData);
    setRiffTimes(buildRiffTimes(processedRiffData));
  }, []);

  // When the songId changes, reset the riffs by downloading the new data
  useEffect(() => {
    const getRiffs = async () => {
      const { response } = await updateServer(`riffs/${songId}`);
      updateRiffs(response.error ? [] : response.data.riffs);
    };
    setRiffs([]);
    getRiffs();
  }, [songId]);

  return { riffs, riffTimes, updateRiffs };
};
