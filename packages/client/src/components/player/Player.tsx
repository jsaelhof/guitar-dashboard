import { useCallback, useEffect, useRef, useState } from "react";
import { dispatchAudioEvent } from "../../utils/audio-events";
import { IconButton, Slider } from "@mui/material";
import { formatSeconds } from "../../utils/format-seconds";
import {
  BookmarkBorder,
  Pause,
  PlayArrow,
  Replay10,
} from "@mui/icons-material";
import { AmpDisplay, AmpLabel } from "./Player.styles";
import AmpDial from "./components/amp-dial/AmpDial";
import { useKeyboardShortcuts } from "./hooks/use-keyboard-shortcuts";
import ThumbComponent from "./components/thumb/Thumb";
import { useAppContext } from "../../context/AppContext";

const Player = () => {
  const {
    disableShortcuts,
    dispatchSongUpdate,
    song: { file, ...song },
    riffTimes,
    dispatchRecentSongsUpdate,
  } = useAppContext();
  const ref = useRef<HTMLAudioElement | null>(null);

  const [volume, setVolume] = useState<number>(0.5);
  const [loop, setLoop] = useState<[number, number?] | null>(null);
  const [sync, setSync] = useState(true);

  // The state of everything related to the audio is in the ref.
  // Rather than storing copies of pieces of data that the UI relies on in useState vars, this just forces a re-render whenever I need.
  // All the player UI is driven off the ref which will update any time this changes.
  const [, setRefresh] = useState<number>(0);
  const refresh = useCallback(() => {
    setRefresh(Date.now());
  }, []);

  const cycleLoop = useCallback(() => {
    setLoop((state) => {
      if (!ref.current || (state && state[1] != null)) {
        return null;
      } else if (state && state.length === 1) {
        return [state[0], ref.current.currentTime];
      } else {
        return [ref.current.currentTime];
      }
    });
  }, [loop]);

  const updateVolume = useCallback((value: number) => {
    setVolume(value);
    if (ref.current) ref.current.volume = value;
  }, []);

  useKeyboardShortcuts(ref, cycleLoop, updateVolume, disableShortcuts);

  // When the file changes, reset anything that shouldn't hold over from the previous song
  useEffect(() => {
    updateVolume(song.settings.volume);
    setLoop(null);
    refresh();
  }, [file]);

  return (
    <div>
      {file ? (
        <>
          <audio
            ref={ref}
            src={`http://localhost:8001/${file}`}
            //autoPlay
            onPlay={(e) => {
              // When a track starts, set its volume to the player's volume
              e.currentTarget.volume = volume;

              // When a track plays for the first time, mark it as recent.
              e.currentTarget.played.length === 0 &&
                dispatchRecentSongsUpdate({ type: "add", songId: song.id });
            }}
            onRateChange={refresh}
            onDurationChange={refresh}
            // onVolumeChange={(e) => {
            //   setVolume(e.currentTarget.volume);
            // }}
            onTimeUpdate={(e) => {
              refresh();
              //setCurrentTime(e.currentTarget.currentTime);

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
            style={{ width: "100%" }}
          />

          {ref.current && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "max-content max-content 1fr 90px 110px max-content max-content max-content",
                // Play Seek Playback Time Loop Speed Volume Sync
                alignItems: "center",
                justifyItems: "center",
                columnGap: 32,
                rowGap: 8,
                backgroundImage: "url('ui/gold.jpeg')",
                backgroundPositionY: "30%",
                backgroundSize: "cover",
                padding: "20px 20px",
                borderRadius: 8,
                border: "2px solid #141414",
                fontSize: 14,
                boxShadow: "inset 0 5px 15px #00000099",
              }}
            >
              {/* Paused is undefined if the track has not started, boolean afterwards. */}
              {!ref.current.paused ? (
                <IconButton onClick={() => ref.current?.pause()}>
                  <Pause />
                </IconButton>
              ) : (
                <IconButton onClick={() => ref.current?.play()}>
                  <PlayArrow />
                </IconButton>
              )}

              <div>
                <IconButton>
                  <Replay10 />
                </IconButton>
              </div>

              <Slider
                // size="small"
                defaultValue={0}
                max={1}
                step={0.01}
                value={
                  loop?.[1] != null
                    ? [
                        ref.current.currentTime / ref.current.duration,
                        loop[0] / ref.current.duration,
                        loop[1] / ref.current.duration,
                      ]
                    : ref.current.currentTime / ref.current.duration
                }
                // Override the thumb component with a custom one.
                slots={{ thumb: ThumbComponent }}
                slotProps={{
                  // Tell the thumb component whether a loop is active.
                  thumb: {
                    "data-loop": loop?.[1] != null,
                  },
                }}
                marks={
                  riffTimes
                    ? riffTimes.map((time) => ({
                        value: ref.current?.duration
                          ? time / ref.current.duration
                          : undefined,
                      }))
                    : undefined
                }
                onChange={(e, value) => {
                  if (typeof value === "number" && ref.current) {
                    ref.current.currentTime = ref.current.duration * value;
                  }
                }}
                onChangeCommitted={(e, value) => {
                  if (typeof value === "number" && ref.current) {
                    ref.current.currentTime = ref.current.duration * value;
                  }
                }}
                valueLabelDisplay="off"
                componentsProps={{
                  mark: {
                    style: {
                      height: 8,
                    },
                  },
                }}
              />

              <div>
                {formatSeconds(Math.floor(ref.current.currentTime))} /{" "}
                {formatSeconds(
                  Math.floor(
                    !isNaN(ref.current.duration) ? ref.current.duration : 0
                  )
                )}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "50px 50px",
                  columnGap: 16,
                  transform: "translateY(8px)",
                }}
              >
                <AmpDisplay on={loop?.[0] != null}>
                  {loop?.[0] != null && (
                    <div>{formatSeconds(Math.round(loop[0]))}</div>
                  )}
                </AmpDisplay>
                <AmpDisplay on={loop?.[1] != null}>
                  {loop?.[1] != null && (
                    <div>{formatSeconds(Math.round(loop[1]))}</div>
                  )}
                </AmpDisplay>
                <AmpLabel small>A</AmpLabel>
                <AmpLabel small>B</AmpLabel>
              </div>

              {/* <AmpDisplay on={!!loop}>
                {!loop && <div>OFF</div>}
                {loop && (
                  <div style={{ display: "flex", gap: 4, fontSize: 14 }}>
                    <div>{formatSeconds(Math.round(loop[0]))}</div>
                    <div>-</div>
                    <div>
                      {loop[1] ? formatSeconds(Math.round(loop[1])) : "?"}
                    </div>
                  </div>
                )}
              </AmpDisplay> */}

              <AmpDial value={ref.current?.playbackRate ?? 1} percent />

              <AmpDial value={volume} />

              <div
                onClick={() => setSync(!sync)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  borderRadius: 6,
                  width: 60,
                  height: 44,
                  backgroundColor: sync ? "rgb(220 50 20)" : "rgb(50 0 0)",
                  boxShadow: sync
                    ? "rgb(0, 15, 15) 0px 0px 30px inset, #FF000099 0px 0px 50px 10px"
                    : "unset",
                  border: "2px solid #141414",
                  color: sync ? "#FFFFFFDD" : "#FFFFFF22",
                  textShadow: "0 2px 3px #00000066",
                }}
              >
                <div>ON</div>
              </div>

              <AmpLabel>Play</AmpLabel>
              <AmpLabel>Seek</AmpLabel>
              <AmpLabel>Playback</AmpLabel>
              <AmpLabel>Time</AmpLabel>
              <AmpLabel>Loop</AmpLabel>
              <AmpLabel>Speed %</AmpLabel>
              <AmpLabel>
                <div>Volume</div>
                <IconButton size="small">
                  <BookmarkBorder
                    onClick={() => {
                      if (ref.current) {
                        dispatchSongUpdate({
                          type: "volume",
                          id: song.id,
                          volume: ref.current.volume,
                        });
                      }
                    }}
                  />
                </IconButton>
              </AmpLabel>
              <AmpLabel>Sync</AmpLabel>
            </div>
          )}
        </>
      ) : (
        "No File"
      )}
    </div>
  );
};

export default Player;
