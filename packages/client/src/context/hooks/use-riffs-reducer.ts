import { useEffect, useReducer } from "react";
import { Riff } from "../../types";
import { updateServer } from "../../utils/update-server";
import { v4 as uuid } from "uuid";

export type RiffsUpdateAction =
  | { type: "init"; riffs: Riff[] }
  | { type: "setTime"; songId: string; riffId: string; value: number }
  | { type: "setOrder"; songId: string; riffId: string; value: number }
  | {
      type: "add";
      songId: string;
      label: string;
      labelDesc: string;
      uri: string[];
    };

export type RiffsUpdateDispatch = (action: RiffsUpdateAction) => void;

const buildRiffTimes = (riffsData: Riff[]) =>
  riffsData.reduce<number[] | null>((acc, riff) => {
    if (riff.time !== undefined) {
      if (!acc) acc = [];
      acc.push(riff.time);
    }
    return acc;
  }, null);

const riffsReducer = (
  state: { riffs: Riff[]; riffTimes: number[] | null },
  action: RiffsUpdateAction
) => {
  if (action.type === "init") {
    return {
      riffs: action.riffs,
      riffTimes: buildRiffTimes(action.riffs),
    };
  }

  // Clone the riffs data
  const riffs: Riff[] = structuredClone(state.riffs);

  // Update the riff data optimistically and call the server to persist.
  // Currently there is no error handling if persisting fails.
  switch (action.type) {
    case "setTime":
      const riff = riffs.find((riff) => riff.id === action.riffId);
      if (riff) {
        riff.time = action.value;
        updateServer(
          `set/rifftime/${action.songId}/${action.riffId}/${action.value}`
        );
      }
      break;

    case "setOrder":
      updateServer(`riff/${action.songId}/${action.riffId}/${action.value}`);
      break;

    case "add":
      const newRiff = {
        id: uuid(),
        label: action.label,
        ...(action.labelDesc && { labelDesc: action.labelDesc }),
        uri: action.uri,
      };

      riffs.push(newRiff);

      updateServer(`set/riffsection/${action.songId}`, newRiff);
      break;
  }

  return {
    riffs,
    riffTimes: buildRiffTimes(riffs),
  };
};

export const useRiffsReducer = (songId: string) => {
  const [{ riffs, riffTimes }, dispatchRiffsUpdate] = useReducer(riffsReducer, {
    riffs: [],
    riffTimes: null,
  });

  // Initialize by downloading the riff data and pushing it into the reducer.
  useEffect(() => {
    const loadRiffs = async () => {
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

      dispatchRiffsUpdate({
        type: "init",
        riffs: riffsData,
      });
    };
    loadRiffs();
  }, [songId]);

  return { riffs, riffTimes, dispatchRiffsUpdate };
};
