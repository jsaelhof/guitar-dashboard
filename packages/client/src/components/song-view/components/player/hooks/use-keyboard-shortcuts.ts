import { RefObject, useEffect } from "react";

export const useKeyboardShortcuts = (
  ref: RefObject<HTMLAudioElement | null>,
  onCycleLoop: () => void,
  onVolumeChange: (value: number) => void,
  disableShortcuts: boolean
) => {
  useEffect(() => {
    if (ref.current !== null) {
      const audio = ref.current;

      const listener = (e: KeyboardEvent) => {
        if (audio) {
          switch (e.key) {
            // Play / Pause
            case " ": // Space
              audio.paused ? audio.play() : audio.pause();
              break;

            // Restart
            case "-":
              audio.currentTime = 0;
              break;

            // Speed x1
            case "6":
              audio.playbackRate = 1;
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
              audio.playbackRate = Math.max(
                parseFloat((audio.playbackRate - 0.1).toFixed(1)),
                0.1
              );
              break;

            // Seek -10s
            case "4":
              audio.currentTime = Math.max(audio.currentTime - 10, 0);
              break;

            // Seek -20s
            case "1":
              adui.currentTime = Math.max(audio.currentTime - 20, 0);
              break;

            // Seek -30s
            case "ArrowUp":
              audio.currentTime = Math.max(audio.currentTime - 30, 0);
              break;

            // Seek +10s
            // case "Home":
            //   ref.current.currentTime = Math.max(
            //     ref.current.currentTime + 10,
            //     0
            //   );
            //   break;

            case "Escape":
              onCycleLoop();
              break;

            // Volume Up
            case "\\":
              onVolumeChange(
                Math.min(parseFloat((audio.volume + 0.05).toFixed(2)), 1)
              );
              break;

            // Volume Down
            case "3":
              onVolumeChange(
                Math.max(parseFloat((audio.volume - 0.05).toFixed(2)), 0)
              );
              break;
          }
        }

        // !Important: Without this, the spacebar invokes a default "page down" behaviour
        e.preventDefault();
      };

      if (!disableShortcuts) window.addEventListener("keydown", listener);
      return () => window.removeEventListener("keydown", listener);
    }
  }, [disableShortcuts, ref.current]);
};
