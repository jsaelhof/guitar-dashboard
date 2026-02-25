import { Loop, Song } from "guitar-dashboard-types";
import {
  useSyncExternalStore,
  useRef,
  type RefObject,
  useMemo,
  useState,
} from "react";
import { AudioControl, AudioState } from "../types";

// Shallow comparison utility function
function shallowEqual(prevState: AudioState, newState: AudioState): boolean {
  const prevKeys = Object.keys(prevState) as Array<keyof AudioState>;
  const newKeys = Object.keys(newState) as Array<keyof AudioState>;

  if (prevKeys.length !== newKeys.length) {
    return false;
  }

  return !prevKeys.some((key) => prevState[key] !== newState[key]);
}

// All the events we want to listen to for audio state changes
const SUBSCRIBED_AUDIO_EVENTS = [
  "timeupdate",
  "durationchange",
  "ratechange",
  // "play",
  // "pause",
  // "ended",
  "volumechange",
  // "loadedmetadata",
  // "loadeddata",
  // "canplay",
  "canplaythrough",
];

export function useAudioStore(song: Song): {
  countInRef: RefObject<HTMLAudioElement | null>;
  audioRef: RefObject<HTMLAudioElement | null>;
  state: AudioState;
  controls: AudioControl;
} {
  const countInRef = useRef<HTMLAudioElement | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Cache the snapshot to prevent infinite loops
  const snapshotRef = useRef<AudioState | null>(null);

  const state = useSyncExternalStore(
    // Subscribe function
    (callback) => {
      const audio = audioRef.current;
      if (!audio) return () => {};

      // Add event listeners
      SUBSCRIBED_AUDIO_EVENTS.forEach((event) =>
        audio.addEventListener(event, callback)
      );

      // Cleanup function
      return () =>
        SUBSCRIBED_AUDIO_EVENTS.forEach((event) =>
          audio.removeEventListener(event, callback)
        );
    },

    // Get snapshot function
    () => {
      const audio = audioRef.current;
      if (!audio) return null;

      const newSnapshot: AudioState = {
        loading: false,
        currentTime: audio.currentTime,
        duration: audio.duration || 0,
        paused: audio.paused,
        volume: audio.volume,
        playbackRate: audio.playbackRate,
      };

      // First snapshot — initialize
      if (!snapshotRef.current) {
        snapshotRef.current = newSnapshot;
        return snapshotRef.current;
      }

      // Only update if something changed
      if (!shallowEqual(snapshotRef.current, newSnapshot)) {
        snapshotRef.current = newSnapshot;
      }

      return snapshotRef.current;
    }
  );

  const controls: AudioControl = useMemo(() => {
    return {
      play: async () => {
        if (audioRef.current) audioRef.current.play();
      },
      pause: () => {
        if (audioRef.current) audioRef.current?.pause();
      },
      setCurrentTime: (value: number) => {
        if (audioRef.current) audioRef.current.currentTime = value;
      },
      setVolume: (value: number) => {
        if (audioRef.current) audioRef.current.volume = value;
      },
      setPlaybackRate: (value: number) => {
        if (audioRef.current) audioRef.current.playbackRate = value;
      },
    };
  }, []);

  return {
    countInRef,
    audioRef,
    //audio: audioRef.current,
    // On first render there won't be data from the audio element yet.
    // Until we have a snapshot, loading stays true.
    // This avoids `state` being nullable and prevents a lot of optional chaining of `state?.<something>` in the code.
    state: state ?? {
      loading: true,
    },
    controls,
  };
}
