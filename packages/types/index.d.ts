export enum Tuning {
  "E" = "E",
  "E_FLAT" = "E_FLAT",
  "DROP_D" = "DROP_D",
  "D" = "D",
  "DROP_C" = "DROP_C",
  "C" = "C",
}

export type Song = {
  id: string;
  title: string; // DB field, but could be from tags
  artist: string; // DB field, but could be from tags
  cover?: string; // Tags
  album?: string; // Tags
  year?: string; // Tags
  file?: string; // The path on the NAS to an mp3 file
  pdf?: string; // The path to a PDF of the tablature
  settings: {
    volume: number;
    pitch: number;
  };
  loops?: Loop[];
  tablature?: Tablature[];
  riffs?: Riff[];
  riffTimes?: number[];
  videos?: VideoResource[];
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

// Defines an entire page of tablature for an instrument
export type Tablature = {
  id: string;
  label: string;
  labelDesc?: string;
  tuning?: Tuning;
  uri: string[];
};

// Defines a smaller section of tablature.
// It extends the idea of Tablature and augments it with additional fields.
export type Riff = Tablature & {
  clones?: string;
  src?: string;
  time?: number;
};

// Defines a YouTube video
export type VideoResource = {
  id: string;
  desc?: string;
  url: string; // A YouTube url (not the embed url, the regular one)
};

export type RecentSong = Pick<Song, "id" | "title" | "artist" | "file">;

export type SongTitleList = Pick<Song, "id" | "title">[];

export type SongsByArtist = Record<string, SongTitleList>;
