import { useEffect } from "react";
import { AudioControl, AudioState, PlayerState } from "../types";

export const useKeyboardShortcuts = (
  state: AudioState,
  controls: AudioControl,
  playerState: PlayerState,
  onCycleLoop: (time: number) => void,
  onVolumeChange: (value: number) => void,
  disableShortcuts: boolean
) => {
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (!state.loading) {
        switch (e.key) {
          // Play / Pause
          case " ": // Space
            state.paused ? controls.play() : controls.pause();
            break;

          // Restart
          case "-":
            controls.setCurrentTime(
              playerState.loop.status === "set" ? playerState.loop.loopA : 0
            );
            break;

          // Speed x1
          case "6":
            controls.setPlaybackRate(1); // TODO: Add a resetPlaybackRate
            break;
          // Speed +10%
          // case "ArrowUp":
          //   const increasedRate = parseFloat(
          //     (ref.current.playbackRate + 0.1).toFixed(1)
          //   );
          //   ref.current.playbackRate = increasedRate;
          //   setSpeed(increasedRate);
          //   break;

          // Speed -10%
          case "Home":
          case "b":
            // Limit this to 10% speed. I don't want it to go to zero and effectively pause, and going negative makes things play backward.
            controls.setPlaybackRate(
              Math.max(parseFloat((state.playbackRate - 0.1).toFixed(1)), 0.1)
            );
            break;

          // Seek -10s
          case "4":
            controls.setCurrentTime(Math.max(state.currentTime - 10, 0));
            break;

          // Seek -20s
          case "1":
            controls.setCurrentTime(Math.max(state.currentTime - 20, 0));
            break;

          // Seek -30s
          case "ArrowUp":
            controls.setCurrentTime(Math.max(state.currentTime - 30, 0));
            break;

          // Seek +10s
          // case "Home":
          //   ref.current.currentTime = Math.max(
          //     ref.current.currentTime + 10,
          //     0
          //   );
          //   break;

          case "Escape":
            onCycleLoop(state.currentTime);
            break;

          // Volume Up
          case "\\":
            onVolumeChange(
              Math.min(parseFloat((state.volume + 0.05).toFixed(2)), 1)
            );
            break;

          // Volume Down
          case "3":
            onVolumeChange(
              Math.max(parseFloat((state.volume - 0.05).toFixed(2)), 0)
            );
            break;
        }
      }

      // !Important: Without this, the spacebar invokes a default "page down" behaviour amongst other things that may be tied to keys.
      // Allow F12 so I can open dev tools!
      // Allow Cmd+ and Cmd- so I can zoom in and out.
      if (
        e.key !== "F12" &&
        !(e.metaKey && e.key === "=") &&
        !(e.metaKey && e.key === "-")
      ) {
        e.preventDefault();
      }
    };

    if (!disableShortcuts) window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [disableShortcuts, state, controls]);
};
