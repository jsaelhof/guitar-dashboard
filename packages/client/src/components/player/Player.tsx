import { useEffect, useRef, useState } from "react";
import { dispatchAudioEvent } from "../../utils/audio-events";
import { FormControlLabel, FormGroup, Switch } from "@mui/material";
import { formatSeconds } from "../../utils/format-seconds";

export type PlayerProps = {
  file?: string;
};

const Player = ({ file }: PlayerProps) => {
  const ref = useRef<HTMLAudioElement | null>(null);

  const [speed, setSpeed] = useState<number>(1);
  const [volume, setVolume] = useState<number>(1);
  const [loop, setLoop] = useState<[number, number?] | null>(null);
  const [sync, setSync] = useState(true);

  useEffect(() => {
    if (ref.current !== null) {
      const listener = (e: KeyboardEvent) => {
        if (ref.current) {
          switch (e.key) {
            // Play / Pause
            case " ": // Space
              ref.current.paused ? ref.current.play() : ref.current.pause();
              break;
            // Restart
            case "-":
              ref.current.currentTime = 0;
              break;
            // Speed x1
            case "6":
              ref.current.playbackRate = 1;
              setSpeed(1);
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
              // Limit this to 10% speed. I don't want it to go to zero and effecitvely pause, and going negative makes things play backward.
              const decreasedRate = parseFloat(
                (ref.current.playbackRate - 0.1).toFixed(1)
              );
              if (decreasedRate >= 0.1) {
                ref.current.playbackRate = decreasedRate;
                setSpeed(decreasedRate);
              }
              break;
            // Seek -10s
            case "4":
              ref.current.currentTime = Math.max(
                ref.current.currentTime - 10,
                0
              );
              break;
            // Seek -20s
            case "1":
              ref.current.currentTime = Math.max(
                ref.current.currentTime - 20,
                0
              );
              break;
            // Seek -30s
            case "ArrowUp":
              ref.current.currentTime = Math.max(
                ref.current.currentTime - 30,
                0
              );
              break;
            // Seek +10s
            // case "Home":
            //   ref.current.currentTime = Math.max(
            //     ref.current.currentTime + 10,
            //     0
            //   );
            //   break;
            case "Escape":
              if (loop && loop[1] != null) {
                setLoop(null);
              } else if (loop && loop.length === 1) {
                setLoop([loop[0], ref.current.currentTime]);
              } else {
                setLoop([ref.current.currentTime]);
              }
              break;
            // Volume Up
            case "\\":
              const increasedVolume = parseFloat(
                (ref.current.volume + 0.05).toFixed(2)
              );
              ref.current.volume = Math.min(increasedVolume, 1);
              break;
            // Volume Down
            case "3":
              const decreasedVolume = parseFloat(
                (ref.current.volume - 0.05).toFixed(2)
              );
              console.log(decreasedVolume);
              ref.current.volume = Math.max(decreasedVolume, 0);
              break;
          }
        }

        // !Important: Without this, the spacebar invokes a default "page down" behaviour
        e.preventDefault();
      };

      window.addEventListener("keydown", listener);
      return () => window.removeEventListener("keydown", listener);
    }
  }, [loop]);

  return (
    <div>
      {file ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "max-content max-content max-content 1fr max-content",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 12,
              padding: "0 16px",
              textAlign: "center",
            }}
          >
            <div>Speed</div>
            <div>{(speed * 100).toFixed(0)}%</div>
          </div>
          <div style={{ fontSize: 12, padding: "0 16px", textAlign: "center" }}>
            <div>Volume</div>
            <div>{(volume * 100).toFixed(0)}%</div>
          </div>
          <div style={{ fontSize: 12, padding: "0 16px", textAlign: "center" }}>
            <div>Loop</div>
            {!loop && <div>-</div>}
            {loop && (
              <div style={{ display: "flex", gap: 8 }}>
                <div>{formatSeconds(Math.round(loop[0]))}</div>
                <div>-</div>
                <div>{loop[1] ? formatSeconds(Math.round(loop[1])) : "?"}</div>
              </div>
            )}
          </div>
          <audio
            ref={ref}
            src={`http://localhost:8001/${file}`}
            controls
            // autoPlay
            onTimeUpdate={(e) => {
              // Check if a loop is defined and it is time to restart the loop
              if (
                loop &&
                loop[1] != null &&
                e.currentTarget.currentTime >= loop[1]
              ) {
                e.currentTarget.currentTime = loop[0];
              }

              // If sync is enabled, broadcast events about the current time
              sync && dispatchAudioEvent(e.currentTarget.currentTime);
            }}
            onVolumeChange={(e) => {
              setVolume(e.currentTarget.volume);
            }}
            style={{ width: "100%" }}
          />
          <FormGroup>
            <FormControlLabel
              control={
                <Switch checked={sync} onChange={() => setSync(!sync)} />
              }
              label="Sync"
            />
          </FormGroup>
        </div>
      ) : (
        "No File"
      )}
    </div>
  );
};

export default Player;
