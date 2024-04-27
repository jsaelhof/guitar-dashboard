// Typing here doesn't really work right.
// This is currently relying on:
//   types/index.d.ts extending the DOM event types
//   types/index.ts rpoviding AudioEvent which extends CustomEvent for this specific payload
// https://www.divotion.com/blog/creating-type-safe-events

import { AudioEvent } from "../types";

export const dispatchAudioEvent = (currentTime: number) => {
  document.dispatchEvent(
    new CustomEvent("updateTime", {
      detail: { currentTime },
    })
  );
};

export const addAudioEventListener = (listener: (e: AudioEvent) => void) => {
  document.addEventListener("updateTime", listener);
};

export const removeAudioEventListener = (listener: (e: AudioEvent) => void) => {
  document.removeEventListener("updateTime", listener);
};
