import { Slider, SliderProps } from "@mui/material";
import { Rail, Thumb, Track } from "./plaback.styles";
import { PlayerState } from "../../types";

export type PlaybackProps = {
  currentTime: number;
  duration: number;
  loop: PlayerState["loop"];
  marks?: {
    value: number;
    label?: React.ReactNode;
  }[];
  onChange: SliderProps["onChange"];
};

const Playback = ({ loop, currentTime, duration, ...props }: PlaybackProps) => (
  <Slider
    defaultValue={0}
    max={1}
    step={0.01}
    value={
      // If there is a complete loop, configure the slider for the loop.
      // Otherwise render the full song state.
      loop.status === "set"
        ? [currentTime / duration, loop.loopA / duration, loop.loopB / duration]
        : currentTime / duration
    }
    // Override the thumb component with a custom one.
    slots={{ thumb: Thumb, rail: Rail, track: Track }}
    slotProps={{
      // Tell the thumb component whether a loop is active.
      thumb: {
        "data-loop": loop.status === "set",
      },
    }}
    valueLabelDisplay="off"
    {...props}
  />
);

export default Playback;
