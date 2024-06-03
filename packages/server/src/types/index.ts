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

export type Songs = { [songId: string]: Song };

export type SongsByArtist = {
  [artist: string]: Pick<Song, "id" | "title">[];
};
