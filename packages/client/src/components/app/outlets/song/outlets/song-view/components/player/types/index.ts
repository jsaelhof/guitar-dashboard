export type AudioState = {
  loading: boolean;
  currentTime: number;
  volume: number;
  duration: number;
  playbackRate: number;
  paused: boolean;
};

export type AudioControl = Pick<HTMLAudioElement, "play" | "pause"> & {
  setVolume: (value: number) => void;
  setCurrentTime: (value: number) => void;
  setPlaybackRate: (value: number) => void;
};

export type PlayerState = {
  sync: boolean;
  startDelayActive: boolean;
  loop:
    | { status: "unset" }
    | ({ id: string; label: string } & (
        | { status: "partial"; loopA: number }
        | { status: "set"; loopA: number; loopB: number }
      ));
};
