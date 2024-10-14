export type ValueOf<T> = T[keyof T];

export type Song = {
  id: string;
  title: string;
  artist: string;
  album?: string;
  year?: string;
  cover?: string;
  tab: string;
  file?: string;
  pdf?: string;
  settings: {
    volume: number;
  };
  loops?: Loop[];
  riffs?: TablatureSegment[];
  tablature?: TablatureSegment[];
};

export type Loop = {
  id: string;
  loopA: number;
  loopB: number;
  label: string;
};

export type TablatureSegment = {
  id: string;
  label: string;
  labelDesc: string;
  uri: string[];
};

export type SongTitleList = Pick<Song, "id" | "title">[];

export type SongsByArtist = Record<string, SongTitleList>;

export type RecentSongRecord = {
  id: string;
  timestamp: number;
};

export type RecentSong = Pick<Song, "id" | "title" | "artist" | "file">;
