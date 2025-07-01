import { useCallback, useEffect, useRef, useState } from "react";
import { formatSeconds } from "../../../../../../utils/format-seconds";
import { Pause, PlayArrow, Replay10 } from "@mui/icons-material";
import {
  AlbumCover,
  AmpDisplay,
  AmpLabel,
  DigitalButton,
  DownButton,
  LeftButton,
  Light,
  PitchLayout,
  PlayerBase,
  RightButton,
  TimeDisplay,
  UpButton,
} from "./Player.styles";
import AmpDial from "./components/amp-dial/AmpDial";
import { useKeyboardShortcuts } from "./hooks/use-keyboard-shortcuts";
import { useAppContext } from "../../../../context/AppContext";
import { CustomEvents, UpdateTimeDetail } from "../../types/events";
import SwitchButton from "../switch-button/SwitchButton";
import Playback from "./components/playback/Playback";
import LoopList from "./components/loop-list/LoopList";
import { NEW_LOOP_ID } from "./constants";
import { Loop, Song } from "guitar-dashboard-types";
import { SongAction } from "../../hooks/use-song";
import { SongsAction } from "../../../../hooks/use-songs";

const MAX_RETRY = 10;

export type PlayerProps = {
  song: Song;
  dispatchSong: (action: SongAction) => void;
  dispatchSongs: (action: SongsAction) => void;
};

export type CustomAudioElement = HTMLAudioElement & {
  loopSec: { loopA: number; loopB?: number | undefined } | undefined;
};

const Player = ({ song, dispatchSong, dispatchSongs }: PlayerProps) => {
  const { disableShortcuts, setDisableShortcuts } = useAppContext();

  const ref = useRef<CustomAudioElement | null>(null);

  const [errorRetryAttempts, setErrorRetryAttempts] = useState(0);

  const [appliedLoop, setAppliedLoop] = useState<Loop | null>(null);
  const [sync, setSync] = useState(true);
  const [pitch, setPitch] = useState<number>(0);

  // The state of everything related to the audio is in the ref.
  // Rather than storing copies of pieces of data that the UI relies on in useState vars, this just forces a re-render whenever I need.
  // All the player UI is driven off the ref which will update any time this changes.
  // TODO: THIS FORCES A RE-RENDER CONSTANTLY
  const [, setRefresh] = useState<number>(0);
  const refresh = useCallback(() => {
    setRefresh(Date.now());
  }, []);

  const cycleLoop = useCallback(() => {
    if (!ref.current) return;
    if (ref.current.loopSec?.loopB != null) {
      ref.current.loopSec = undefined;
      setAppliedLoop(null);
    } else if (ref.current.loopSec?.loopA) {
      ref.current.loopSec.loopB = ref.current.currentTime;
    } else {
      ref.current.loopSec = {
        loopA: ref.current.currentTime,
      };
    }
  }, []);

  const updateVolume = useCallback((value: number) => {
    if (ref.current) {
      ref.current.volume = value;

      dispatchSong({
        type: "volume",
        volume: value,
      });
    }
  }, []);

  const updatePitch = useCallback((value: number) => {
    setPitch(value);

    dispatchSong({
      type: "pitch",
      pitch: value,
    });
  }, []);

  // Initialize any settings when the file changes
  useEffect(() => {
    song && updateVolume(song.settings.volume ?? 0.5);
    song && setPitch(song.settings.pitch);
    refresh();
  }, [song?.file]);

  // Update any loop-related things when the loop data changes (after save/delete/update actions are saved)
  useEffect(() => {
    // If a "New Loop" was just saved, the applied loop will have no data but the loops will have a new one that matches the times. Set it as the applied loop.
    if (
      song?.loops &&
      !appliedLoop &&
      ref.current?.loopSec &&
      ref.current.loopSec.loopB != null
    ) {
      song.loops.forEach(
        (savedLoop) =>
          ref.current?.loopSec &&
          savedLoop.loopA === ref.current.loopSec.loopA &&
          savedLoop.loopB === ref.current.loopSec.loopB &&
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
              src={`${import.meta.env.VITE_SERVER_URL}/${song.file}`}
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
                  ref.current?.loopSec &&
                  ref.current.loopSec.loopB != null &&
                  e.currentTarget.currentTime >= ref.current.loopSec.loopB
                ) {
                  e.currentTarget.currentTime = ref.current.loopSec.loopA;
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
                  marks={(song?.riffTimes ?? []).map((time) => ({
                    value: ref.current?.duration
                      ? time / ref.current.duration
                      : 0,
                  }))}
                />

                <TimeDisplay>
                  {`${formatSeconds(
                    Math.round(ref.current.currentTime)
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
                    {ref.current.loopSec && (
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

                    <Light $on={ref.current.loopSec?.loopA != null} />
                    <AmpLabel small>A</AmpLabel>
                    <LeftButton
                      // Decrease Loop A, can't be less than 0 (track start)
                      onClick={() => {
                        if (ref.current?.loopSec?.loopA != null) {
                          ref.current.loopSec.loopA = Math.max(
                            ref.current.loopSec.loopA - 1,
                            0
                          );
                        }
                      }}
                    />
                    <AmpDisplay $on={ref.current.loopSec?.loopA != null}>
                      {ref.current.loopSec?.loopA != null && (
                        <div>
                          {formatSeconds(Math.round(ref.current.loopSec.loopA))}
                        </div>
                      )}
                    </AmpDisplay>
                    <RightButton
                      // Increase Loop A, can't be more than Loop B - 1. Loop B may not be set yet so also have to check track duration.
                      onClick={() => {
                        if (ref.current && ref.current.loopSec?.loopA != null) {
                          ref.current.loopSec.loopA = Math.min(
                            ref.current.loopSec.loopA + 1, // Time + 1
                            ref.current.duration, // Track length
                            ...(ref.current.loopSec.loopB != null
                              ? [ref.current.loopSec.loopB - 1]
                              : []) // If exists, Loop B - 1
                          );
                        }
                      }}
                    />

                    <Light $on={ref.current.loopSec?.loopB != null} />
                    <AmpLabel small>B</AmpLabel>
                    <LeftButton
                      // Decrease Loop B, can't be less than Loop A + 1
                      onClick={() => {
                        if (
                          ref.current?.loopSec?.loopB != null &&
                          ref.current.loopSec.loopA != null
                        ) {
                          ref.current.loopSec.loopB = Math.max(
                            ref.current.loopSec.loopB - 1,
                            ref.current.loopSec.loopA + 1
                          );
                        }
                      }}
                    />
                    <AmpDisplay $on={ref.current.loopSec?.loopB != null}>
                      {ref.current.loopSec?.loopB != null && (
                        <div>
                          {formatSeconds(Math.round(ref.current.loopSec.loopB))}
                        </div>
                      )}
                    </AmpDisplay>
                    <RightButton
                      // Increase Loop B, can't be more than the track length.
                      // Weird little issue here... if the loop is set to end at the exact track end, it won't loop because it pauses when it reaches the end of playback.
                      // This is basically impossible to set using the keyboard shortcuts but using the arrows, it can, so I've set the max to be a fraction of a second below the track end.
                      onClick={() => {
                        if (ref.current?.loopSec?.loopB != null) {
                          ref.current.loopSec.loopB = Math.min(
                            ref.current.loopSec.loopB + 1,
                            ref.current.duration - 0.0001
                          );
                        }
                      }}
                    />
                  </div>
                </div>

                <PitchLayout>
                  {/* Pitch is undefined if its never been set for a song. */}
                  <UpButton
                    onClick={() => updatePitch(Math.min((pitch ?? 0) + 1, 100))}
                  />
                  <AmpDisplay $on={pitch !== undefined}>
                    <div>
                      {pitch !== undefined
                        ? pitch === 0
                          ? pitch
                          : pitch < 0
                          ? `${pitch} ♭`
                          : `+${pitch} ♯`
                        : ""}
                    </div>
                  </AmpDisplay>
                  <DownButton
                    onClick={() =>
                      updatePitch(Math.max((pitch ?? 0) - 1, -100))
                    }
                  />
                </PitchLayout>

                <AmpDial
                  value={ref.current?.playbackRate ?? 1}
                  percent
                  onAdjustValue={(newVal: number) => {
                    if (ref.current) ref.current.playbackRate = newVal;
                  }}
                />

                <AmpDial
                  value={ref.current.volume}
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
                    on={!!ref.current.loopSec?.loopB}
                    onClick={() => {
                      if (ref.current) {
                        ref.current.loopSec = undefined;
                      }
                      setAppliedLoop(null);
                    }}
                  />
                  <div>Loop</div>

                  <LoopList
                    disabled={
                      // Disable the loop list if the song has no loops and there's no pending loop set.
                      (!song?.loops || song.loops.length === 0) &&
                      (!ref.current.loopSec ||
                        ref.current.loopSec.loopB == null)
                    }
                    loops={song?.loops ?? []}
                    appliedLoop={
                      appliedLoop ??
                      (ref.current.loopSec?.loopB
                        ? {
                            loopA: ref.current.loopSec.loopA,
                            loopB: ref.current.loopSec.loopB,
                          }
                        : undefined)
                    }
                    onOpenChange={setDisableShortcuts}
                    onSet={(loopData: Loop) => {
                      setAppliedLoop(loopData);
                      if (ref.current) {
                        ref.current.loopSec = { ...loopData };
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
                        if (ref.current) ref.current.loopSec = undefined;
                      } else {
                        // If this loop being deleted is currently set, clear it.
                        if (loop.id === appliedLoop?.id) {
                          if (ref.current) ref.current.loopSec = undefined;
                          setAppliedLoop(null);
                        }
                        dispatchSong({ type: "deleteloop", ...loop });
                      }
                    }}
                    onClear={() => {
                      if (ref.current) ref.current.loopSec = undefined;
                      setAppliedLoop(null);
                    }}
                  />
                </AmpLabel>
                <AmpLabel>Pitch</AmpLabel>
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
