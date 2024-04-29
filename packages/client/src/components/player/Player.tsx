import { useEffect, useRef, useState } from "react";
import { dispatchAudioEvent } from "../../utils/audio-events";
import { formatSeconds } from "../../utils/format-seconds";
import {
  MediaControlBar,
  MediaController,
  MediaPlayButton,
  MediaSeekBackwardButton,
  MediaTimeDisplay,
  MediaTimeRange,
  MediaVolumeRange,
} from "media-chrome/react";
import {
  useMediaSelector,
  useMediaDispatch,
  MediaProvider,
  MediaActionTypes,
} from "media-chrome/dist/react/media-store";

export type PlayerProps = {
  file?: string;
};

const PlaybackRateDisplay = () => {
  // Dispatch media state change requests using useMediaDispatch()
  const dispatch = useMediaDispatch();
  // Get the latest media state you care about in your component using useMediaSelector()
  const { mediaPlaybackRate, ...state } = useMediaSelector((state) => state);
  return (
    mediaPlaybackRate && (
      <div
        style={{
          height: "100%",
          lineHeight: "44px",
          fontWeight: "bold",
          alignSelf: "center",
          padding: "0 10px",
          cursor: "pointer",
        }}
        onClick={(e) => {
          const decreasedRate = parseFloat(
            (mediaPlaybackRate - 0.1).toFixed(1)
          );
          console.log(state);
          dispatch({
            type: MediaActionTypes.MEDIA_PLAYBACK_RATE_REQUEST,
            detail: decreasedRate,
          });
        }}
      >
        {mediaPlaybackRate * 100}%
      </div>
    )
  );
};

const Player = ({ file }: PlayerProps) => {
  const ref = useRef<HTMLAudioElement | null>(null);

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
              break;
            // Speed +10%
            // case "ArrowUp":
            //   const increasedRate = parseFloat(
            //     (ref.current.playbackRate + 0.1).toFixed(1)
            //   );
            //   ref.current.playbackRate = increasedRate;
            //   break;
            // Speed -10%
            case "Home":
            case "2":
              // Limit this to 10% speed. I don't want it to go to zero and effecitvely pause, and going negative makes things play backward.
              const decreasedRate = parseFloat(
                (ref.current.playbackRate - 0.1).toFixed(1)
              );
              if (decreasedRate >= 0.1) {
                ref.current.playbackRate = decreasedRate;
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

  const state = useMediaSelector((state) => state);

  return (
    <MediaProvider>
      <div>
        {file ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr max-content",
              alignItems: "center",
              gap: 16,
              backgroundImage: "url('ui/gold.webp')",
              backgroundSize: "cover",
              padding: "20px 20px",
              borderRadius: 8,
              border: "2px solid #141414",
            }}
          >
            <MediaController
              audio
              style={{
                width: "100%",
                height: 44,
                borderRadius: 50,
                overflow: "hidden",
              }}
              noHotkeys
            >
              <audio
                slot="media"
                src={`http://localhost:8001/${file}`}
                ref={ref}
                onTimeUpdate={(e) => {
                  console.log(state);
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
              />
              <MediaControlBar
                style={{
                  width: "100%",
                  padding: "0 12px",
                  display: "grid",
                  gridTemplateColumns: "45px 65px 40px 1fr 100px 100px 100px",
                  alignItems: "center",
                }}
              >
                <MediaPlayButton />
                <PlaybackRateDisplay />
                <MediaSeekBackwardButton seekOffset={10} />
                <MediaTimeRange />
                <MediaTimeDisplay showDuration />
                <MediaVolumeRange />
                <div
                  style={{
                    height: 44,
                    lineHeight: "100%",
                    fontSize: 14,
                    display: "grid",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  {!loop && <div>OFF</div>}
                  {loop && (
                    <div style={{ display: "flex", gap: 4 }}>
                      <div>{formatSeconds(Math.round(loop[0]))}</div>
                      <div>-</div>
                      <div>
                        {loop[1] ? formatSeconds(Math.round(loop[1])) : "?"}
                      </div>
                    </div>
                  )}
                </div>
              </MediaControlBar>
            </MediaController>

            <div
              onClick={() => setSync(!sync)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                borderRadius: 6,
                padding: "0 8px",
                height: "100%",
                backgroundColor: sync ? "rgb(220 50 20)" : "rgb(50 0 0)",
                boxShadow: sync
                  ? "rgb(0, 15, 15) 0px 0px 30px inset, #FF000099 0px 0px 50px 10px"
                  : "unset",
                border: "2px solid #141414",
                color: sync ? "#FFFFFFDD" : "#FFFFFF22",
                width: 50,
                textShadow: "0 2px 3px #00000066",
              }}
            >
              <div>ON</div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "45px 65px 45px 1fr 100px 100px 100px",
                padding: "0 12px",
              }}
            >
              <div></div>
              <div
                style={{
                  color: "#242424",
                  fontWeight: 600,
                  justifySelf: "center",
                  fontSize: 14,
                }}
              >
                SPEED
              </div>
              <div></div>
              <div
                style={{
                  color: "#242424",
                  fontWeight: 600,
                  justifySelf: "center",
                  fontSize: 14,
                }}
              >
                PLAYBACK
              </div>
              <div
                style={{
                  color: "#242424",
                  fontWeight: 600,
                  justifySelf: "center",
                  fontSize: 14,
                }}
              >
                TIME
              </div>
              <div
                style={{
                  color: "#242424",
                  fontWeight: 600,
                  justifySelf: "center",
                  fontSize: 14,
                }}
              >
                VOLUME
              </div>
              <div
                style={{
                  color: "#242424",
                  fontWeight: 600,
                  justifySelf: "center",
                  fontSize: 14,
                }}
              >
                LOOP
              </div>
            </div>
            <div
              style={{
                color: "#242424",
                fontWeight: 600,
                justifySelf: "center",
                fontSize: 14,
              }}
            >
              SYNC
            </div>
          </div>
        ) : (
          "No File"
        )}
      </div>
    </MediaProvider>
  );
};

export default Player;
