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
  loops?: {
    id: string;
    loopA: number;
    loopB: number;
    label: string;
  }[];
};

export type SongsByArtist = {
  [artist: string]: Pick<Song, "id" | "title">[];
};

export type Songs = {
  [songId: string]: string;
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

export type RecentSong = Pick<Song, "id" | "title" | "artist">;
