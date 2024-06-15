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
    // size="small"
    defaultValue={0}
    max={1}
    step={0.01}
    value={
      loop?.[1] != null
        ? [
            audioRef.currentTime / audioRef.duration,
            loop[0] / audioRef.duration,
            loop[1] / audioRef.duration,
          ]
        : // Duration is NaN if the file doesn't load, even though it doesn't get rendered. I think it happens on first render when it's trying to load before audio.error becomes true.
        isNaN(audioRef.duration)
        ? 0
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
    onChange={(e, value) => {
      if (typeof value === "number" && audioRef) {
        audioRef.currentTime = audioRef.duration * value;
      }
    }}
    onChangeCommitted={(e, value) => {
      if (typeof value === "number" && audioRef) {
        audioRef.currentTime = audioRef.duration * value;
      }
    }}
    valueLabelDisplay="off"
  />
);

export default Playback;
