import { useActionState, useCallback, useEffect } from "react";
import { Riff } from "../../types";

type FetchRiffsResponse = { data: { riffs: Riff[] } };

export const useRiffs = (songId: string) => {
  const [{ riffs, riffTimes }, getRiffs, isPending] = useActionState<
    {
      riffs: Riff[];
      riffTimes: number[] | null;
    },
    string
  >(
    async (_, songId: string) => {
      const response = await fetch(`http://localhost:8001/riffs/${songId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const {
        data: { riffs },
      } = (await response.json()) as FetchRiffsResponse;

      // If this riff clones another, find it and overlay this data over the cloned data.
      // This allows a riff to clone another one and just change the label/time
      const processedRiffData = riffs.map((riff) =>
        riff.clones
          ? { ...riffs.find(({ id }) => riff.clones === id), ...riff }
          : riff
      );

      // Find the times associated with each riff.
      const riffTimes = processedRiffData.reduce<number[] | null>(
        (acc, riff) => {
          if (riff.time !== undefined) {
            if (!acc) acc = [];
            acc.push(riff.time);
          }
          return acc;
        },
        null
      );

      return {
        riffs: processedRiffData,
        riffTimes,
      };
    },
    {
      riffs: [],
      riffTimes: [],
    }
  );

  const dispatch = useCallback(
    async (
      action:
        | {
            type: "add";
            id: string;
            label: string;
            labelDesc?: string;
            uri: string[];
          }
        | {
            type: "time";
            songId: string;
            riffId: string;
            seconds: number;
          }
        | {
            type: "order";
            songId: string;
            riffId: string;
            order: number;
          }
    ) => {
      await fetch(`http://localhost:8001/riffs/${action.type}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(action),
      });

      // Refetch.
      getRiffs(songId);
    },
    []
  );

  useEffect(() => getRiffs(songId), [songId]);

  return { riffs, riffTimes, dispatch };
};
