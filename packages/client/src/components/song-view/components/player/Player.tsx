import { useCallback, useEffect, useRef, useState } from "react";
import { formatSeconds } from "../../../../utils/format-seconds";
import { Pause, PlayArrow, Replay10 } from "@mui/icons-material";
import {
  AlbumCover,
  AmpDisplay,
  AmpLabel,
  DigitalButton,
  LeftButton,
  Light,
  PlayerBase,
  RightButton,
  TimeDisplay,
} from "./Player.styles";
import AmpDial from "./components/amp-dial/AmpDial";
import { useKeyboardShortcuts } from "./hooks/use-keyboard-shortcuts";
import { useAppContext } from "../../../../context/AppContext";
import { CustomEvents, UpdateTimeDetail } from "../../../../types/events";
import SwitchButton from "./components/switch-button/SwitchButton";
import Playback from "./components/playback/Playback";
import LoopList from "./components/loop-list/LoopList";
import { NEW_LOOP_ID } from "./constants";
import { Loop } from "guitar-dashboard-types";

const MAX_RETRY = 10;

const Player = () => {
  const {
    disableShortcuts,
    setDisableShortcuts,
    song,
    riffTimes,
    dispatchSong,
    dispatchSongs,
  } = useAppContext();

  const ref = useRef<HTMLAudioElement | null>(null);

  const [errorRetryAttempts, setErrorRetryAttempts] = useState(0);

  const [volume, setVolume] = useState<number>(0.5);
  const [appliedLoop, setAppliedLoop] = useState<Loop | null>(null);
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
        setAppliedLoop(null);
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

  // Initialize any settings when the file changes
  useEffect(() => {
    song && updateVolume(song.settings.volume);
    refresh();
  }, [song?.file]);

  // Update any loop-related things when the loop data changes (after save/delete/update actions are saved)
  useEffect(() => {
    // If a "New Loop" was just saved, the applied loop will have no data but the loops will have a new one that matches the times. Set it as the applied loop.
    if (song?.loops && !appliedLoop && loop && loop[1] != null) {
      song.loops.forEach(
        (savedLoop) =>
          savedLoop.loopA === loop[0] &&
          savedLoop.loopB === loop[1] &&
          setAppliedLoop(savedLoop)
      );
    }
  }, [song?.loops]);

  useKeyboardShortcuts(ref, cycleLoop, updateVolume, disableShortcuts);

  return (
    <div>
      {errorRetryAttempts < MAX_RETRY ? (
        <>
          {song?.id && (
            <audio
              ref={ref}
              crossOrigin="anonymous"
              src={`http://localhost:8001/${song.file}`}
              //src={"/04 Rock Believer.mp3"}
              onError={(event) => {
                // Suddenly started having an issue where the file won't load the first time about 75% of the time but if I click it again it works.
                // Can't figure out if its a network problem but when it happens I get the "Unable to load file" view like the NAS is not connected.
                // This seems to work to just mindlessly retry it. Would be nice to figure out what's going on.
                if (errorRetryAttempts < MAX_RETRY) {
                  setTimeout(() => {
                    setErrorRetryAttempts(errorRetryAttempts + 1);
                    ref.current?.load();
                  }, 100);
                }
              }}
              onPlay={(e) => {
                // When a track starts, set its volume to the player's volume
                e.currentTarget.volume = volume;

                // When a track plays for the first time, mark it as recent.
                e.currentTarget.played.length === 0 &&
                  dispatchSongs({ type: "recent", songId: song.id });
              }}
              onRateChange={refresh}
              onDurationChange={refresh}
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
                    new CustomEvent<UpdateTimeDetail>(
                      CustomEvents.UPDATE_TIME,
                      {
                        detail: {
                          currentTime: e.currentTarget.currentTime,
                          totalTime: e.currentTarget.duration,
                          percentPlayed:
                            e.currentTarget.currentTime /
                            e.currentTarget.duration,
                        },
                      }
                    )
                  );
              }}
              style={{
                width: "100%",
              }}
            />
          )}

          <PlayerBase $hasCover={!!song?.cover}>
            {ref.current && !isNaN(ref.current?.duration ?? NaN) && (
              <>
                {song?.cover && <AlbumCover $cover={song?.cover} />}

                {/* 
                Paused is undefined if the track has not started, boolean afterwards. 
                This looks a bit weird to show "play" when paused is undefined but I'm trying to show the player at all times even when the song isn't loaded.
                */}
                {!ref.current.paused ? (
                  <DigitalButton onClick={() => ref.current?.pause()}>
                    <Pause />
                  </DigitalButton>
                ) : (
                  <DigitalButton onClick={() => ref.current?.play()}>
                    <PlayArrow />
                  </DigitalButton>
                )}

                {/* TODO: Do I need this as a physical buttom? It's mostly a foot-shortcut thing...can't see myself clicking it much. */}
                <DigitalButton
                  onClick={() => {
                    if (ref.current) {
                      ref.current.currentTime = Math.max(
                        ref.current.currentTime - 10,
                        0
                      );
                    }
                  }}
                >
                  <Replay10 />
                </DigitalButton>

                {/* Would be nice NOT to pass the ref but if I don't, the ref values are alaways stale because they don't cause a re-render */}
                <Playback
                  audioRef={ref.current}
                  loop={loop}
                  marks={(riffTimes ?? []).map((time) => ({
                    value: ref.current?.duration
                      ? time / ref.current.duration
                      : 0,
                  }))}
                />

                <TimeDisplay>
                  {`${formatSeconds(
                    Math.floor(ref.current.currentTime)
                  )} / ${formatSeconds(
                    Math.round(
                      !isNaN(ref.current.duration) ? ref.current.duration : 0
                    )
                  )}`}
                </TimeDisplay>

                <div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "auto 20px auto 50px auto",
                      rowGap: 4,
                      alignItems: "center",
                      columnGap: 4,
                    }}
                  >
                    {loop && (
                      <div
                        style={{
                          fontFamily: "Circular",
                          fontSize: 12,
                          textAlign: "center",
                          gridColumn: "3 / -1",
                        }}
                      >
                        {appliedLoop?.label ?? "New Loop"}
                      </div>
                    )}

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
                </div>

                <AmpDial
                  value={ref.current?.playbackRate ?? 1}
                  percent
                  onAdjustValue={(newVal: number) => {
                    if (ref.current) ref.current.playbackRate = newVal;
                  }}
                />

                <AmpDial
                  value={volume}
                  divisions="20"
                  onAdjustValue={(newVal: number) => updateVolume(newVal)}
                />

                <SwitchButton on={sync} onClick={() => setSync(!sync)} />

                <AmpLabel>Play</AmpLabel>
                <AmpLabel>Seek</AmpLabel>
                <AmpLabel>Playback</AmpLabel>
                <AmpLabel>Time</AmpLabel>
                <AmpLabel>
                  <SwitchButton
                    size="small"
                    on={!!(loop && loop[1])}
                    onClick={() => {
                      setLoop(null);
                      setAppliedLoop(null);
                    }}
                  />
                  <div>Loop</div>

                  <LoopList
                    disabled={
                      // Disable the loop list if the song has no loops and there's no pending loop set.
                      (!song?.loops || song.loops.length === 0) &&
                      (!loop || loop[1] === undefined)
                    }
                    loops={song?.loops ?? []}
                    appliedLoop={
                      appliedLoop ??
                      (loop && loop[1]
                        ? { loopA: loop[0], loopB: loop[1] }
                        : undefined)
                    }
                    onOpenChange={setDisableShortcuts}
                    onSet={(loopData: Loop) => {
                      setAppliedLoop(loopData);
                      setLoop([loopData.loopA, loopData.loopB]);
                      if (ref.current) {
                        ref.current.currentTime = loopData.loopA;
                      }
                    }}
                    onSave={({ id, ...loopData }: Loop) => {
                      // If this is saving the NEW_LOOP, then send a create action, otherwise send an update.
                      // The BE could be set up to handle this as upsert.
                      if (id === NEW_LOOP_ID) {
                        dispatchSong({ type: "loop", ...loopData });
                      } else {
                        dispatchSong({
                          type: "updateloop",
                          id,
                          ...loopData,
                        });
                      }
                    }}
                    onDelete={(loop: Loop) => {
                      if (loop.id === NEW_LOOP_ID) {
                        setLoop(null);
                      } else {
                        // If this loop being deleted is currently set, clear it.
                        if (loop.id === appliedLoop?.id) {
                          setLoop(null);
                          setAppliedLoop(null);
                        }
                        dispatchSong({ type: "deleteloop", ...loop });
                      }
                    }}
                    onClear={() => {
                      setLoop(null);
                      setAppliedLoop(null);
                    }}
                  />

                  {/* <DigitalSaveButton
                    // If a loop isn't fully set or the loop exactly matches an existing loop, disable the button
                    disabled={
                      loop?.[1] == null ||
                      !!song?.loops?.find(
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
                        // Update the current selected loop or, if one is not set, create a new one.
                        appliedLoop
                          ? dispatchSong({
                              type: "updateloop",
                              ...appliedLoop,
                              loopA: loop[0],
                              loopB: loop[1],
                            })
                          : dispatchSong({
                              type: "loop",
                              loopA: loop[0],
                              loopB: loop[1],
                              // TODO: Build a UI that allows entering the loop name or at least editing this name wherever loops are displayed.
                              label: `Loop ${(song?.loops ?? []).length + 1}`,
                            });
                      }
                    }}
                  /> */}
                </AmpLabel>
                <AmpLabel>Speed %</AmpLabel>
                <AmpLabel>Volume</AmpLabel>
                <AmpLabel>Sync</AmpLabel>
              </>
            )}
          </PlayerBase>
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
  );
};

export default Player;
