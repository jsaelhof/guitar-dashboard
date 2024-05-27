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

export type Songs = { [songId: string]: Song };

export type SongsByArtist = {
  [artist: string]: Pick<Song, "id" | "title">[];
};
