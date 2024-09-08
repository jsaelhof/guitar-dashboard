import { useCallback, useEffect, useRef, useState } from "react";
import { formatSeconds } from "../../../../utils/format-seconds";
import { Pause, PlayArrow, Replay10 } from "@mui/icons-material";
import {
  AmpDisplay,
  AmpLabel,
  DigitalButton,
  DigitalSaveButton,
  LeftButton,
  Light,
  PlayerBase,
  RightButton,
  TimeDisplay,
} from "./Player.styles";
import AmpDial from "./components/amp-dial/AmpDial";
import { useKeyboardShortcuts } from "./hooks/use-keyboard-shortcuts";
import { useAppContext } from "../../../../context/AppContext";
import {
  CustomEvents,
  PlaySavedLoopDetail,
  UpdateTimeDetail,
} from "../../../../types/events";
import SwitchButton from "./components/switch-button/SwitchButton";
import Playback from "./components/playback/Playback";

const MAX_RETRY = 10;

const Player = () => {
  const { disableShortcuts, song, riffTimes, dispatchSong, dispatchSongs } =
    useAppContext();
  const ref = useRef<HTMLAudioElement | null>(null);

  const [errorRetryAttempts, setErrorRetryAttempts] = useState(0);

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
    if (ref.current) {
      ref.current.volume = value;

      dispatchSong({
        type: "volume",
        volume: ref.current.volume,
      });
    }
  }, []);

  useKeyboardShortcuts(ref, cycleLoop, updateVolume, disableShortcuts);

  // When the file changes, reset anything that shouldn't hold over from the previous song
  useEffect(() => {
    setErrorRetryAttempts(0);
    song && updateVolume(song.settings.volume);
    setLoop(null);
    refresh();
  }, [song?.file]);

  // This hook sets up a listener for events.
  useEffect(() => {
    const listener = ({
      detail: { loopA, loopB },
    }: CustomEvent<PlaySavedLoopDetail>) => {
      setLoop([loopA, loopB]);
      if (ref.current) {
        ref.current.currentTime = loopA;
      }
    };

    document.addEventListener(CustomEvents.PLAY_SAVED_LOOP, listener);

    () => {
      document.removeEventListener(CustomEvents.PLAY_SAVED_LOOP, listener);
    };
  }, []);

  return song ? (
    <div>
      {song.file && errorRetryAttempts < MAX_RETRY ? (
        <>
          <audio
            ref={ref}
            src={`http://localhost:8001/${song.file}`}
            onError={(event) => {
              console.log("ERROR", event.currentTarget.error);
              // Suddenly started having an issue where the file won't load the first time about 75% of the time but if I click it again it works.
              // Can't figure out if its a network problem but when it happens I get the "Unable to load file" view like the NAS is not connected.
              // This seems to work to just mindlessly retry it. Would be nice to figure out what's going on.
              if (errorRetryAttempts < MAX_RETRY) {
                setTimeout(() => {
                  console.log("RETRY", errorRetryAttempts);
                  setErrorRetryAttempts(errorRetryAttempts + 1);
                  ref.current?.load();
                }, 100);
              }
            }}
            //autoPlay
            onPlay={(e) => {
              // When a track starts, set its volume to the player's volume
              e.currentTarget.volume = volume;

              // When a track plays for the first time, mark it as recent.
              e.currentTarget.played.length === 0 &&
                dispatchSongs({ type: "recent", songId: song.id });
            }}
            onRateChange={refresh}
            onDurationChange={refresh}
            // onVolumeChange={(e) => {
            //   setVolume(e.currentTarget.volume);
            // }}
            onTimeUpdate={(e) => {
              refresh();
              // Check if a loop is defined and it is time to restart the loop
              if (
                loop &&
                loop[1] != null &&
                e.currentTarget.currentTime >= loop[1]
              ) {
                e.currentTarget.currentTime = loop[0];
              }

              // If sync is enabled, broadcast events about the current time
              sync &&
                document.dispatchEvent(
                  new CustomEvent<UpdateTimeDetail>(CustomEvents.UPDATE_TIME, {
                    detail: { currentTime: e.currentTarget.currentTime },
                  })
                );
            }}
            style={{
              width: "100%",
            }}
          />

          {/* Don't show the player until the song was actually successfully loaded. This could be used to show a loading state. I could also make sure there's a proper height placeholder so it doesn't jump around. */}
          {ref.current && !isNaN(ref.current?.duration ?? NaN) && (
            <PlayerBase>
              {/* Paused is undefined if the track has not started, boolean afterwards. */}
              {!ref.current.paused ? (
                <DigitalButton onClick={() => ref.current?.pause()}>
                  <Pause />
                </DigitalButton>
              ) : (
                <DigitalButton onClick={() => ref.current?.play()}>
                  <PlayArrow />
                </DigitalButton>
              )}

              <div>
                <DigitalButton>
                  <Replay10 />
                </DigitalButton>
              </div>

              {/* Should this take callbacks instead of passing in the audio ref? */}
              <Playback
                audioRef={ref.current}
                loop={loop}
                marks={
                  riffTimes
                    ? riffTimes.map((time) => ({
                        value: ref.current?.duration
                          ? time / ref.current.duration
                          : 0,
                      }))
                    : undefined
                }
              />

              <TimeDisplay>
                {formatSeconds(Math.floor(ref.current.currentTime))} /{" "}
                {formatSeconds(
                  Math.round(
                    !isNaN(ref.current.duration) ? ref.current.duration : 0
                  )
                )}
              </TimeDisplay>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto 20px auto 50px auto",
                  rowGap: 4,
                  alignItems: "center",
                  columnGap: 4,
                }}
              >
                <Light $on={loop?.[0] != null} />
                <AmpLabel small>A</AmpLabel>
                <LeftButton
                  // Decrease Loop A, can't be less than 0 (track start)
                  onClick={() =>
                    loop?.[0] != null &&
                    setLoop([Math.max(loop[0] - 1, 0), loop[1]])
                  }
                />
                <AmpDisplay $on={loop?.[0] != null}>
                  {loop?.[0] != null && (
                    <div>{formatSeconds(Math.round(loop[0]))}</div>
                  )}
                </AmpDisplay>
                <RightButton
                  // Increase Loop A, can't be more than Loop B - 1. Loop B may not be set yet so also have to check track duration.
                  onClick={() =>
                    loop?.[0] != null &&
                    ref.current &&
                    setLoop([
                      Math.min(
                        loop[0] + 1, // Time + 1
                        ref.current.duration, // Track length
                        ...(loop?.[1] != null ? [loop[1] - 1] : []) // If exists, Loop B - 1
                      ),
                      loop[1],
                    ])
                  }
                />

                <Light $on={loop?.[1] != null} />
                <AmpLabel small>B</AmpLabel>
                <LeftButton
                  // Decrease Loop B, can't be less than Loop A + 1
                  onClick={() =>
                    loop?.[1] != null &&
                    loop?.[0] != null &&
                    setLoop([loop[0], Math.max(loop[1] - 1, loop[0] + 1)])
                  }
                />
                <AmpDisplay $on={loop?.[1] != null}>
                  {loop?.[1] != null && (
                    <div>{formatSeconds(Math.round(loop[1]))}</div>
                  )}
                </AmpDisplay>
                <RightButton
                  // Increase Loop B, can't be more than the track length.
                  // Weird little issue here... if the loop is set to end at the exact track end, it won't loop because it pauses when it reaches the end of playback.
                  // This is basically impossible to set using the keyboard shortcuts but using the arrows, it can, so I've set the max to be a fraction of a second below the track end.
                  onClick={() =>
                    loop?.[1] != null &&
                    ref.current &&
                    setLoop([
                      loop[0],
                      Math.min(loop[1] + 1, ref.current.duration - 0.0001),
                    ])
                  }
                />
              </div>

              <AmpDial value={ref.current?.playbackRate ?? 1} percent />

              <AmpDial value={volume} divisions="5" />

              <SwitchButton on={sync} onClick={() => setSync(!sync)} />

              <AmpLabel>Play</AmpLabel>
              <AmpLabel>Seek</AmpLabel>
              <AmpLabel>Playback</AmpLabel>
              <AmpLabel>Time</AmpLabel>
              <AmpLabel>
                <div>Loop</div>
                <DigitalSaveButton
                  // If a loop isn't fully set or the loop exactly matches an existing loop, disable the button
                  disabled={
                    loop?.[1] == null ||
                    !!song.loops?.find(
                      ({ loopA, loopB }) =>
                        loop[0] === loopA && loop[1] === loopB
                    )
                  }
                  onClick={() => {
                    if (
                      ref.current &&
                      loop &&
                      loop[0] != null &&
                      loop[1] != null
                    ) {
                      dispatchSong({
                        type: "loop",
                        loopA: loop[0],
                        loopB: loop[1],
                        // TODO: Build a UI that allows entering the loop name or at least editing this name wherever loops are displayed.
                        label: `Loop ${(song.loops ?? []).length + 1}`,
                      });
                    }
                  }}
                />
              </AmpLabel>
              <AmpLabel>Speed %</AmpLabel>
              <AmpLabel>Volume</AmpLabel>
              <AmpLabel>Sync</AmpLabel>
            </PlayerBase>
          )}
        </>
      ) : (
        <div
          style={{
            width: "100%",
            height: "100px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          File could not be loaded
        </div>
      )}
    </div>
  ) : null;
};

export default Player;
