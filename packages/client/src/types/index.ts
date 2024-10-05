export type Song = {
  id: string;
  title: string;
  artist: string;
  cover?: string;
  tab: string;
  file?: string;
  pdf?: string;
  settings: {
    volume: number;
  };
  loops?: Loop[];
};

export type Loop = {
  id: string;
  loopA: number;
  loopB: number;
  label: string;
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

export type Tab = {
  id: string;
  label: string;
  labelDesc?: string;
  uri?: string[];
};

export type RecentSong = Pick<Song, "id" | "title" | "artist">;
