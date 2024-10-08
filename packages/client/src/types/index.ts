export type Song = {
  id: string;
  title: string; // DB field, but could be from tags
  artist: string; // DB field, but could be from tags
  cover?: string; // Tags
  album?: string; // Tags
  year?: string; // Tags
  tab: string;
  file?: string;
  pdf?: string;
  settings: {
    volume: number;
  };
  loops?: Loop[];
  metrics?: {
    plays?: number;
  };
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
