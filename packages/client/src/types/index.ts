export type AudioEvent = CustomEvent<{ currentTime: number }>;

export type Song = {
  id: string;
  title: string;
  artist: string;
  tab: string;
  file?: string;
  pdf?: string;
};

export type SongsByArtist = {
  [key: string]: Song[];
};

export type SongDict = {
  [key: string]: Song;
};

export type Riff = {
  label: string;
  labelDesc?: string;
  src?: string;
  uri?: string[];
  time?: number;
};
