import { useEffect } from "react";

export const useKeyboardShortcuts = ({
  onTogglePlay,
  onRestart,
  onResetSpeed,
  onSpeedDecrease,
  onSeekBackward,
  onCycleLoop,
  onVolumeDown,
  onVolumeUp,
  disableShortcuts,
}: {
  onTogglePlay: () => void;
  onRestart: () => void;
  onResetSpeed: () => void;
  onSpeedDecrease: () => void;
  onSeekBackward: (seconds: number) => void;
  onCycleLoop: () => void;
  onVolumeDown: () => void;
  onVolumeUp: () => void;
  disableShortcuts: boolean;
}) => {
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      switch (e.key) {
        // Play / Pause
        case " ": // Space
          onTogglePlay();
          break;

        // Restart
        case "-":
          onRestart();
          break;

        // Speed x1
        case "6":
          onResetSpeed();
          break;

        // Speed +10%
        // case "ArrowUp":
        //   onSpeedIncrease();
        /*
          const increasedRate = parseFloat(
            (ref.current.playbackRate + 0.1).toFixed(1)
          );
        */
        //   break;

        // Speed -10%
        case "Home":
        case "b":
          onSpeedDecrease();
          break;

        // Seek -10s
        case "4":
          onSeekBackward(10);
          break;

        // Seek -20s
        case "1":
          onSeekBackward(20);
          break;

        // Seek -30s
        case "ArrowUp":
          onSeekBackward(30);
          break;

        // Seek +10s
        // case "Home":
        //   onSeekForward(10)
        //   break;

        case "Escape":
          onCycleLoop();
          break;

        // Volume Up
        case "\\":
          onVolumeUp();
          break;

        // Volume Down
        case "3":
          onVolumeDown();
          break;
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
  }, [disableShortcuts]);
};
