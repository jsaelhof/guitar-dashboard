import { useCallback, useEffect, useRef, useState } from "react";
import { useExercise } from "./hooks/use-exercise";
import Tablature from "../../../songs/outlets/song-view/components/tablature/Tablature";
import { useParams } from "react-router-dom";
import {
  AmpLabel,
  Content,
  DigitalButton,
  PlayerBase,
  TabPanel,
  TimeDisplay,
} from "./Exercise.styles";
import { Pause, PlayArrow } from "@mui/icons-material";
import { formatSeconds } from "../../../../utils/format-seconds";
import Playback from "../../../songs/outlets/song-view/components/player/components/playback/Playback";
import AmpDial from "../../../songs/outlets/song-view/components/player/components/amp-dial/AmpDial";
import { Typography } from "@mui/material";

const MAX_RETRY = 10;

export const Exercise = () => {
  const { exerciseId } = useParams();
  const { exercise, dispatch } = useExercise(exerciseId ?? "");

  const ref = useRef<HTMLAudioElement | null>(null);

  const [errorRetryAttempts, setErrorRetryAttempts] = useState(0);

  // The state of everything related to the audio is in the ref.
  // Rather than storing copies of pieces of data that the UI relies on in useState vars, this just forces a re-render whenever I need.
  // All the player UI is driven off the ref which will update any time this changes.
  const [, setRefresh] = useState<number>(0);
  const refresh = useCallback(() => {
    setRefresh(Date.now());
  }, []);

  useEffect(() => {
    if (exercise && ref.current) {
      ref.current.playbackRate = exercise.speed;
      ref.current.volume = exercise.song.settings.volume;
      ref.current.currentTime = exercise.loop.loopA;
    }
  }, [exercise]);

  // FIXME: See if volume in the song player.tsx can use this pattern (using refresh() instead of keeping the volume value in a useState).
  const updateSpeed = useCallback((value: number) => {
    if (ref.current) {
      ref.current.playbackRate = value;

      dispatch({
        type: "speed",
        speed: value,
      });

      refresh();
    }
  }, []);

  return (
    exercise && (
      <Content>
        <Typography variant="h5" sx={{ lineHeight: 1.2 }}>
          {exercise.title}
        </Typography>

        <div>
          <audio
            ref={ref}
            crossOrigin="anonymous"
            src={`${import.meta.env.VITE_SERVER_URL}/${exercise.song.file}`}
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
              e.currentTarget.volume = exercise.song.settings.volume ?? 0.5;
            }}
            onTimeUpdate={(e) => {
              refresh();
              // Check if a loop is defined and it is time to restart the loop
              if (e.currentTarget.currentTime >= exercise.loop.loopB) {
                e.currentTarget.currentTime = exercise.loop.loopA;
              }
            }}
            style={{
              width: "100%",
            }}
          />

          <PlayerBase>
            {ref.current && !isNaN(ref.current?.duration ?? NaN) && (
              <>
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

                {/* Would be nice NOT to pass the ref but if I don't, the ref values are alaways stale because they don't cause a re-render */}
                <Playback
                  audioRef={ref.current}
                  loop={[exercise.loop.loopA, exercise.loop.loopB]}
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

                <AmpDial
                  value={ref.current?.playbackRate ?? 1}
                  percent
                  onAdjustValue={(newVal: number) => updateSpeed(newVal)}
                />

                <AmpDial
                  value={exercise.song.settings.volume}
                  divisions="20"
                  // FIXME: This needs to update the song data. I could either useSong's dispatch but it won't merge the response with the exercise data.
                  // OR -- I could add an action to useExercise that updates the volume and the BE can maybe re-use the volume update.
                  //onAdjustValue={(newVal: number) => updateVolume(newVal)}
                />

                <AmpLabel>Play</AmpLabel>
                <AmpLabel>Playback</AmpLabel>
                <AmpLabel>Time</AmpLabel>
                <AmpLabel>Speed %</AmpLabel>
                <AmpLabel>Volume</AmpLabel>
              </>
            )}
          </PlayerBase>
        </div>

        <TabPanel>
          <Tablature tablature={exercise.tablature} />
        </TabPanel>
      </Content>
    )
  );
};
