import { Slider } from "@mui/material";
import { Rail, Thumb, Track } from "./playback.styles";
import { AudioControl, AudioState, PlayerState } from "../../types";

export type PlaybackProps = {
  marks?: {
    value: number;
    label?: React.ReactNode;
  }[];
  state: Extract<AudioState, { loading: false }>;
  controls: AudioControl;
  playerState: PlayerState;
};

const Playback = ({ state, controls, playerState, marks }: PlaybackProps) => (
  <Slider
    defaultValue={0}
    max={1}
    step={0.01}
    value={
      // If there is a complete loop, configure the slider for the loop.
      // Otherwise render the full song state.
      playerState.loop.status === "set"
        ? [
            state.currentTime / state.duration,
            playerState.loop.loopA / state.duration,
            playerState.loop.loopB / state.duration,
          ]
        : state.currentTime / state.duration
    }
    // Override the thumb component with a custom one.
    slots={{ thumb: Thumb, rail: Rail, track: Track }}
    slotProps={{
      // Tell the thumb component whether a loop is active.
      thumb: {
        "data-loop": playerState.loop.status === "set",
      },
    }}
    marks={marks}
    onChange={(e, value, activeThumb) => {
      if (value instanceof Array) {
        // Loop
        controls.setCurrentTime(state.duration * value[activeThumb]);
      } else {
        // No Loop
        controls.setCurrentTime(state.duration * value);
      }
    }}
    valueLabelDisplay="off"
  />
);

export default Playback;
