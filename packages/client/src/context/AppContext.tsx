import {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import { Riff, Song, Songs, SongsByArtist } from "../types";
import { SongUpdateDispatch, useSongsReducer } from "./hooks/use-songs-reducer";
import { useParams } from "react-router-dom";
import {
  RiffsUpdateDispatch,
  useRiffsReducer,
} from "./hooks/use-riffs-reducer";
import {
  RecentSongsUpdateDispatch,
  useRecentSongsReducer,
} from "./hooks/use-recent-songs-reducer";

export type AppContextType = {
  init: boolean;
  songId: string;
  song: Song;
  songs: Songs;
  songsByArtist: SongsByArtist;
  dispatchSongUpdate: SongUpdateDispatch;
  riffs: Riff[];
  riffTimes: number[] | null;
  dispatchRiffsUpdate: RiffsUpdateDispatch;
  recentSongIds: string[];
  dispatchRecentSongsUpdate: RecentSongsUpdateDispatch;
  disableShortcuts: boolean;
  setDisableShortcuts: (disabled: boolean) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: PropsWithChildren) => {
  const { songId = "" } = useParams();
  const { songs, songsByArtist, dispatchSongUpdate } = useSongsReducer();
  const { riffs, riffTimes, dispatchRiffsUpdate } = useRiffsReducer(songId);
  const { recentSongIds, dispatchRecentSongsUpdate } = useRecentSongsReducer();

  // When needing to accept typed input, such as adding new riffs, I need to disable the keyboard shortcuts listener.
  // Since I want keyboard shortcuts to apply to the whole page (so I don't have to deal with focus issues), that listener prevents default which eats the keystrokes.
  // When these are disabled, I can type into the fields to add new riffs.
  // I don't see a need to have foot-controls enabled while adding a riff so I'm toggling it.
  const [disableShortcuts, setDisableShortcuts] = useState(false);

  const value = useMemo(
    () => ({
      init: Object.keys(songs).length > 0,
      songId,
      song: songs[songId],
      songs,
      songsByArtist,
      dispatchSongUpdate,
      riffs,
      riffTimes,
      dispatchRiffsUpdate,
      recentSongIds,
      dispatchRecentSongsUpdate,
      disableShortcuts,
      setDisableShortcuts,
    }),
    [
      songId,
      songs,
      songsByArtist,
      dispatchSongUpdate,
      riffs,
      riffTimes,
      dispatchRiffsUpdate,
      recentSongIds,
      dispatchRecentSongsUpdate,
      disableShortcuts,
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
