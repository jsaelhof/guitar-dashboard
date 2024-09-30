import { useActionState, useEffect } from "react";
import { Riff } from "../../types";

type FetchRiffsResponse = { data: { riffs: Riff[] } };

export const useRiffs = (songId: string) => {
  const [{ riffs, riffTimes }, dispatch, isPending] = useActionState<
    {
      riffs: Riff[];
      riffTimes: number[] | null;
    },
    | {
        type: "get";
      }
    | {
        type: "add";
        id: string;
        label: string;
        labelDesc?: string;
        uri: string[];
      }
    | {
        type: "time";
        riffId: string;
        seconds: number;
      }
    | {
        type: "order";
        riffId: string;
        order: number;
      }
  >(
    async (_, { type, ...body }) => {
      const response = await fetch(
        `http://localhost:8001/riffs/${songId}${
          type !== "get" ? `/${type}` : ""
        }`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          ...(type !== "get" && {
            method: "POST",
            body: JSON.stringify(body),
          }),
        }
      );
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

  useEffect(() => dispatch({ type: "get" }), [songId]);

  return { riffs, riffTimes, dispatch, isPending };
};
