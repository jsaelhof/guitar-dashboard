export type AudioEvent = CustomEvent<{ currentTime: number }>;

export type Song = {
  id: string;
  title: string;
  artist: string;
  tab: string;
  file?: string;
  pdf?: string;
  settings: {
    volume: number;
  };
};

export type SongsByArtist = {
  [artist: string]: Song[];
};

export type Songs = {
  [songId: string]: Song;
};

export type Riff = {
  clones?: string;
  id: string;
  label: string;
  labelDesc?: string;
  src?: string;
  uri?: string[];
  time?: number;
};
