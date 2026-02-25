import { Pause, PlayArrow, Replay10 } from "@mui/icons-material";
import { Loop, Song } from "guitar-dashboard-types";
import { useCallback, useEffect } from "react";
import { StereoLight } from "../../../../../../components/stereo-light/StereoLight";
import { formatSeconds } from "../../../../../../utils/format-seconds";
import { useAppContext } from "../../../../context/AppContext";
import { SongsAction } from "../../../../hooks/use-songs";
import { SongAction } from "../../hooks/use-song";
import { CustomEvents, UpdateTimeDetail } from "../../types/events";
import SwitchButton from "../switch-button/SwitchButton";
import AmpDial from "./components/amp-dial/AmpDial";
import LoopList from "./components/loop-list/LoopList";
import Playback from "./components/playback/Playback";
import { NEW_LOOP_ID } from "./constants";
import { useAudioStore } from "./hooks/use-audio-store";
import { useKeyboardShortcuts } from "./hooks/use-keyboard-shortcuts";
import { usePlayerState } from "./hooks/use-player-state";
import {
  AlbumCover,
  AmpDisplay,
  AmpLabel,
  DigitalButton,
  DownButton,
  LeftButton,
  PitchLayout,
  PlayerBase,
  RightButton,
  TimeDisplay,
  UpButton,
} from "./Player.styles";

const START_DELAY_MS = 1050;

export type PlayerProps = {
  song: Song;
  dispatchSong: (action: SongAction) => void;
  dispatchSongs: (action: SongsAction) => void;
};

const Player = ({ song, dispatchSong, dispatchSongs }: PlayerProps) => {
  const { disableShortcuts, setDisableShortcuts } = useAppContext();
  const { countInRef, audioRef, state, controls } = useAudioStore(song);
  console.log("audioState", state);

  const [playerState, playerActions] = usePlayerState();

  const updateVolume = useCallback(
    (value: number) => {
      controls.setVolume(value);
      dispatchSong({
        type: "volume",
        volume: value,
      });
    },
    [controls]
  );

  // Initialize any settings when the file changes and the audio is ready.
  useEffect(() => {
    if (song && !state.loading) {
      updateVolume(song.settings.volume ?? 0.5);
    }
  }, [song.settings.volume, state.loading]);

  // TODO: I don't love having to pass all this junk in. I think this should maybe just take a set of event handlers like onRestart() which can then access state here.
  useKeyboardShortcuts(
    state,
    controls,
    playerState,
    playerActions.cycleLoop,
    updateVolume,
    disableShortcuts
  );

  return (
    <div>
      <audio ref={countInRef} src="/click.mp3" />

      {song?.id && (
        <audio
          ref={audioRef}
          crossOrigin="anonymous"
          src={`${import.meta.env.VITE_SERVER_URL}/${song.file}`}
          //src={"/04 Rock Believer.mp3"}
          {...(!state.loading && {
            onPlay: (e) => {
              //connectHTMLAudioToWebAudio();
              // When a track plays for the first time, mark it as recent.
              e.currentTarget.played.length === 0 &&
                dispatchSongs({ type: "recent", songId: song.id });
            },

            onPlaying: (e) => {
              if (state.currentTime <= 0.5 && song.settings.startOffset) {
                controls.setCurrentTime(song.settings.startOffset);
              }

              // This event occurs whenever the track starts or unpauses.
              // If this song has a start delay enabled and this is the start of the track (not paused somewhere in between),
              // then this immediately pauses for second before resuming play. This is helpful on tracks that have a guitar part
              // that starts exactly at 0 seconds (ex: Limelight).
              if (
                state.currentTime <= 0.05 &&
                song.settings.startDelay &&
                !playerState.startDelayActive
              ) {
                if (countInRef?.current) {
                  countInRef.current.currentTime = 0;
                  countInRef.current.play();
                }
                controls.pause();
                playerActions.activateStartDelay();
                setTimeout(() => {
                  if (state) {
                    controls.play();
                    playerActions.deactivateStartDelay();
                  }
                }, START_DELAY_MS);
              }
            },

            onTimeUpdate: (e) => {
              // Check if a loop is defined and it is time to restart the loop
              if (
                playerState.loop.status === "set" &&
                e.currentTarget.currentTime >= playerState.loop.loopB
              ) {
                controls.setCurrentTime(playerState.loop.loopA);
              }

              // If sync is enabled, broadcast events about the current time
              playerState.sync &&
                document.dispatchEvent(
                  new CustomEvent<UpdateTimeDetail>(CustomEvents.UPDATE_TIME, {
                    detail: {
                      currentTime: e.currentTarget.currentTime,
                      totalTime: e.currentTarget.duration,
                      percentPlayed:
                        e.currentTarget.currentTime / e.currentTarget.duration,
                    },
                  })
                );
            },
          })}
        />
      )}

      {/* Wait for audio element state to be ready before rendering the player. This avoids a render of default audio state values. */}
      {!state.loading && (
        <PlayerBase $hasCover={!!song?.cover}>
          {!isNaN(state.duration ?? NaN) && (
            <>
              {song.cover && <AlbumCover $cover={song.cover} />}

              {/*
                Paused is undefined if the track has not started, boolean afterwards. 
                This looks a bit weird to show "play" when paused is undefined but I'm trying to show the player at all times even when the song isn't loaded.
                */}
              {!state.paused ? (
                <DigitalButton onClick={controls.pause}>
                  <Pause />
                </DigitalButton>
              ) : (
                <DigitalButton onClick={controls.play}>
                  <PlayArrow />
                </DigitalButton>
              )}

              {/* TODO: Do I need this as a physical button? It's mostly a foot-shortcut thing...can't see myself clicking it much. */}
              <DigitalButton
                onClick={() => {
                  controls.setCurrentTime(Math.max(state.currentTime - 10, 0));
                }}
              >
                <Replay10 />
              </DigitalButton>

              {/* TODO: This comment is from the pre-audioState code... I'm not sure its true now. ---> Would be nice NOT to pass the ref but if I don't, the ref values are alaways stale because they don't cause a re-render */}
              {/* TODO: Sucks having to pass all the state in here. Callbacks? */}
              <Playback
                state={state}
                controls={controls}
                playerState={playerState}
                marks={(song.riffTimes ?? []).map((time) => ({
                  value: state.duration ? time / state.duration : 0,
                }))}
              />

              <TimeDisplay>
                {`${formatSeconds(
                  Math.round(state.currentTime)
                )} / ${formatSeconds(
                  Math.round(!isNaN(state.duration) ? state.duration : 0)
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
                  {playerState.loop.status !== "unset" && (
                    <div
                      style={{
                        fontFamily: "Circular",
                        fontSize: 12,
                        textAlign: "center",
                        gridColumn: "3 / -1",
                      }}
                    >
                      {playerState.loop.label}
                    </div>
                  )}

                  <StereoLight $on={playerState.loop.status !== "unset"} />
                  <AmpLabel small>A</AmpLabel>
                  <LeftButton onClick={playerActions.decreaseLoopStart} />
                  <AmpDisplay $on={playerState.loop.status !== "unset"}>
                    {playerState.loop.status !== "unset" && (
                      <div>
                        {formatSeconds(Math.round(playerState.loop.loopA))}
                      </div>
                    )}
                  </AmpDisplay>
                  <RightButton
                    onClick={() =>
                      playerActions.increaseLoopStart(state.duration)
                    }
                  />

                  <StereoLight $on={playerState.loop.status === "set"} />
                  <AmpLabel small>B</AmpLabel>
                  <LeftButton onClick={playerActions.decreaseLoopEnd} />
                  <AmpDisplay $on={playerState.loop.status === "set"}>
                    {playerState.loop.status === "set" && (
                      <div>
                        {formatSeconds(Math.round(playerState.loop.loopB))}
                      </div>
                    )}
                  </AmpDisplay>
                  <RightButton
                    onClick={() =>
                      playerActions.increaseLoopEnd(state.duration)
                    }
                  />
                </div>
              </div>

              <PitchLayout>
                {/* Pitch is undefined if its never been set for a song. */}
                <UpButton
                // onClick={
                //    () => updatePitch(Math.min((song.settings.pitch ?? 0) + 1, 100))
                // }
                />
                <AmpDisplay $on={song.settings.pitch !== undefined}>
                  <div>
                    {song.settings.pitch
                      ? `${song.settings.pitch}${
                          song.settings.pitch < 0 ? " ♭" : " ♯"
                        }`
                      : ""}
                  </div>
                </AmpDisplay>
                <DownButton
                // onClick={() =>
                //   updatePitch(Math.max((song.settings.pitch ?? 0) - 1, -100))
                // }
                />
              </PitchLayout>

              <AmpDial
                value={state.playbackRate}
                percent
                onAdjustValue={controls.setPlaybackRate}
              />

              <AmpDial
                value={state.volume}
                divisions="20"
                onAdjustValue={updateVolume}
              />

              <SwitchButton
                on={playerState.sync}
                onClick={playerActions.toggleSync}
              />

              <AmpLabel>Play</AmpLabel>
              <AmpLabel>Seek</AmpLabel>
              <AmpLabel>Playback</AmpLabel>
              <AmpLabel>Time</AmpLabel>
              <AmpLabel>
                <SwitchButton
                  size="small"
                  on={playerState.loop.status === "set"}
                  disabled={playerState.loop.status !== "set"}
                  onClick={() => {
                    playerActions.clearLoop();
                  }}
                />
                <div>Loop</div>

                <LoopList
                  disabled={
                    // Disable the loop list if the song has no loops and there's no pending loop set.
                    (!song?.loops || song.loops.length === 0) &&
                    playerState.loop.status !== "set"
                  }
                  loops={[
                    ...(song?.loops ?? []),
                    // If there is an active loop that is a new unsaved loop, add it, so that it appears and can be saved.
                    ...(playerState.loop.status === "set" &&
                    playerState.loop.id === NEW_LOOP_ID
                      ? [playerState.loop]
                      : []),
                  ]}
                  activeLoop={playerState.loop.status === "set"}
                  onOpenChange={setDisableShortcuts}
                  onSet={(loopData: Loop) => {
                    playerActions.setLoop(loopData);
                    controls.setCurrentTime(loopData.loopA);
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
                    playerActions.clearLoop();

                    if (loop.id !== NEW_LOOP_ID) {
                      dispatchSong({ type: "deleteloop", ...loop });
                    }
                  }}
                  onClear={() => {
                    playerActions.clearLoop();
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
      )}
    </div>
  );
};

export default Player;
