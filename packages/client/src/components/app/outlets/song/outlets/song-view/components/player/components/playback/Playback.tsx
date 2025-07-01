import { Slider } from "@mui/material";
import { Rail, Thumb, Track } from "./playback.styles";
import { CustomAudioElement } from "../../Player";

export type PlaybackProps = {
  marks?: {
    value: number;
    label?: React.ReactNode;
  }[];
  audioRef: CustomAudioElement;
};

const Playback = ({ audioRef, marks }: PlaybackProps) => (
  <Slider
    defaultValue={0}
    max={1}
    step={0.01}
    value={
      // If there is a complete loop, configure the slider for the loop.
      // Otherwise render the full song state.
      audioRef.loopSec?.loopB != null
        ? [
            audioRef.currentTime / audioRef.duration,
            audioRef.loopSec.loopA / audioRef.duration,
            audioRef.loopSec.loopB / audioRef.duration,
          ]
        : audioRef.currentTime / audioRef.duration
    }
    // Override the thumb component with a custom one.
    slots={{ thumb: Thumb, rail: Rail, track: Track }}
    slotProps={{
      // Tell the thumb component whether a loop is active.
      thumb: {
        "data-loop": audioRef.loopSec?.loopB != null,
      },
    }}
    marks={marks}
    onChange={(e, value, activeThumb) => {
      if (value instanceof Array) {
        // Loop
        audioRef.currentTime = audioRef.duration * value[activeThumb];
      } else {
        // No Loop
        audioRef.currentTime = audioRef.duration * value;
      }
    }}
    valueLabelDisplay="off"
  />
);

export default Playback;
