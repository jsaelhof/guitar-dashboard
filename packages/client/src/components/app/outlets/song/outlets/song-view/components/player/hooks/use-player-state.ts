import { Loop } from "guitar-dashboard-types";
import { useMemo, useReducer } from "react";
import { NEW_LOOP_ID } from "../constants";
import { PlayerState } from "../types";

export const playerStateReducer = (
  state: PlayerState,
  action:
    | { type: "toggleSync" }
    | { type: "activateStartDelay" }
    | { type: "deactivateStartDelay" }
    | { type: "clearLoop" }
    | { type: "setLoop"; loop: Loop }
    | { type: "decreaseLoopStart" }
    | { type: "increaseLoopStart"; trackDuration: number }
    | { type: "decreaseLoopEnd" }
    | { type: "increaseLoopEnd"; trackDuration: number }
    | { type: "cycleLoop"; time: number },
) => {
  switch (action.type) {
    case "toggleSync":
      return {
        ...state,
        sync: !state.sync,
      };

    case "activateStartDelay":
      return {
        ...state,
        startDelayActive: true,
      };

    case "deactivateStartDelay":
      return {
        ...state,
        startDelayActive: false,
      };

    case "clearLoop":
      return {
        ...state,
        loop: { status: "unset" as const },
      };

    case "setLoop":
      return {
        ...state,
        loop: {
          status: "set" as const,
          ...action.loop,
        },
      };

    case "decreaseLoopStart":
      // Can't adjust a loop without an existing start time
      if (state.loop.status === "unset") return state;

      return {
        ...state,
        loop: {
          ...state.loop,
          loopA: Math.max(state.loop.loopA - 1, 0),
        },
      };

    case "increaseLoopStart":
      // Can't adjust a loop without an existing start time
      if (state.loop.status === "unset") return state;

      return {
        ...state,
        loop: {
          ...state.loop,
          loopA: Math.min(
            state.loop.loopA + 1, // Time + 1
            action.trackDuration, // Track length
            ...(state.loop.status === "set" ? [state.loop.loopB - 1] : []), // If exists, Loop B - 1
          ),
        },
      };

    case "decreaseLoopEnd":
      // Can't adjust a loop without an existing end time
      if (state.loop.status !== "set") return state;

      return {
        ...state,
        loop: {
          ...state.loop,
          loopB: Math.max(state.loop.loopB - 1, state.loop.loopA + 1),
        },
      };

    case "increaseLoopEnd":
      // Can't adjust a loop without an existing end time
      if (state.loop.status !== "set") return state;

      return {
        ...state,
        loop: {
          ...state.loop,
          loopB: Math.min(
            state.loop.loopB + 1,
            // Weird little issue here... if the loop is set to end at the exact track end, it won't loop because it pauses when it reaches the end of playback.
            // This is basically impossible to set using the keyboard shortcuts but using the arrows, it can, so I've set the max to be a fraction of a second below the track end.
            action.trackDuration - 0.1,
          ),
        },
      };

    case "cycleLoop": {
      if (state.loop.status === "unset") {
        return {
          ...state,
          loop: {
            status: "partial" as const,
            id: NEW_LOOP_ID,
            label: "New Loop",
            loopA: action.time,
          },
        };
      } else if (state.loop.status === "partial") {
        return {
          ...state,
          loop: {
            ...state.loop,
            status: "set" as const,
            loopB: action.time,
          },
        };
      } else if (state.loop.status === "set") {
        return {
          ...state,
          loop: {
            status: "unset" as const,
          },
        };
      }
    }

    default:
      throw Error("Unknown action.");
  }
};

export const usePlayerState = (): [
  state: PlayerState,
  actions: {
    toggleSync: () => void;
    activateStartDelay: () => void;
    deactivateStartDelay: () => void;
    clearLoop: () => void;
    setLoop: (loop: Loop) => void;
    decreaseLoopStart: () => void;
    increaseLoopStart: (trackDuration: number) => void;
    decreaseLoopEnd: () => void;
    increaseLoopEnd: (trackDuration: number) => void;
    cycleLoop: (time: number) => void;
  },
] => {
  const [playerState, dispatch] = useReducer(playerStateReducer, {
    sync: true,
    startDelayActive: false,
    loop: { status: "unset" },
  });

  const actions = useMemo(
    () => ({
      toggleSync: () => dispatch({ type: "toggleSync" }),
      activateStartDelay: () => dispatch({ type: "activateStartDelay" }),
      deactivateStartDelay: () => dispatch({ type: "deactivateStartDelay" }),
      clearLoop: () => dispatch({ type: "clearLoop" }),
      setLoop: (loop: Loop) => dispatch({ type: "setLoop", loop }),
      decreaseLoopStart: () => dispatch({ type: "decreaseLoopStart" }),
      increaseLoopStart: (trackDuration: number) =>
        dispatch({ type: "increaseLoopStart", trackDuration }),
      decreaseLoopEnd: () => dispatch({ type: "decreaseLoopEnd" }),
      increaseLoopEnd: (trackDuration: number) =>
        dispatch({ type: "increaseLoopEnd", trackDuration }),
      cycleLoop: (time: number) => dispatch({ type: "cycleLoop", time }),
    }),
    [],
  );

  return [playerState, actions];
};
