import {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import { RecentSong, Riff, Song, SongsByArtist } from "../types";
import { useParams } from "react-router-dom";
import { useRiffs } from "./hooks/use-riffs";
import { useSong } from "./hooks/use-song";
import { useSongs } from "./hooks/use-songs";

export type AppContextType = {
  song?: Song;
  songsByArtist: SongsByArtist;
  riffs: Riff[];
  riffTimes: number[] | null;
  recentSongs: RecentSong[];
  disableShortcuts: boolean;
  setDisableShortcuts: (disabled: boolean) => void;
  dispatchSongs: ReturnType<typeof useSongs>["dispatch"];
  dispatchSong: ReturnType<typeof useSong>["dispatch"];
  dispatchRiffs: ReturnType<typeof useRiffs>["dispatch"];
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: PropsWithChildren) => {
  const { songId = "" } = useParams();
  const { songsByArtist, recentSongs, dispatch: dispatchSongs } = useSongs();
  const { song, dispatch: dispatchSong } = useSong(songId);
  const { riffs, riffTimes, dispatch: dispatchRiffs } = useRiffs(songId);

  // When needing to accept typed input, such as adding new riffs, I need to disable the keyboard shortcuts listener.
  // Since I want keyboard shortcuts to apply to the whole page (so I don't have to deal with focus issues), that listener prevents default which eats the keystrokes.
  // When these are disabled, I can type into the fields to add new riffs.
  // I don't see a need to have foot-controls enabled while adding a riff so I'm toggling it.
  const [disableShortcuts, setDisableShortcuts] = useState(false);

  const value = useMemo(
    () => ({
      song,
      songsByArtist,
      riffs,
      riffTimes,
      recentSongs,
      disableShortcuts,
      setDisableShortcuts,
      dispatchSongs,
      dispatchSong,
      dispatchRiffs,
    }),
    [
      songsByArtist,
      riffs,
      riffTimes,
      recentSongs,
      disableShortcuts,
      dispatchSongs,
      dispatchSong,
      dispatchRiffs,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};
