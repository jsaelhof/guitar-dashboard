import { Slider } from "@mui/material";
import { Rail, Thumb, Track } from "./playback.styles";

export type PlaybackProps = {
  loop: [number, (number | undefined)?] | null;
  marks?: {
    value: number;
    label?: React.ReactNode;
  }[];
  audioRef: HTMLAudioElement;
};

const Playback = ({ loop, audioRef, marks }: PlaybackProps) => (
  <Slider
    defaultValue={0}
    max={1}
    step={0.01}
    value={
      // If there is a complete loop, configure the slider for the loop.
      // Otherwise render the full song state.
      loop?.[1] != null
        ? [
            audioRef.currentTime / audioRef.duration,
            loop[0] / audioRef.duration,
            loop[1] / audioRef.duration,
          ]
        : audioRef.currentTime / audioRef.duration
    }
    // Override the thumb component with a custom one.
    slots={{ thumb: Thumb, rail: Rail, track: Track }}
    slotProps={{
      // Tell the thumb component whether a loop is active.
      thumb: {
        "data-loop": loop?.[1] != null,
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
