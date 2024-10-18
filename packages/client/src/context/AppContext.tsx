import {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import { useRiffs } from "./hooks/use-riffs";
import { useSong } from "./hooks/use-song";
import { useSongs } from "./hooks/use-songs";
import { useTab } from "./hooks/use-tab";
import {
  RecentSong,
  Riff,
  Song,
  SongsByArtist,
  Tablature,
} from "guitar-dashboard-types";

export type AppContextType = {
  song?: Song;
  songIsPending: boolean;
  songsByArtist: SongsByArtist;
  riffs: Riff[];
  riffsIsPending: boolean;
  riffTimes: number[] | null;
  tab: Tablature[];
  tabIsPending: boolean;
  recentSongs: RecentSong[];
  disableShortcuts: boolean;
  setDisableShortcuts: (disabled: boolean) => void;
  dispatchSongs: ReturnType<typeof useSongs>["dispatch"];
  dispatchSong: ReturnType<typeof useSong>["dispatch"];
  dispatchRiffs: ReturnType<typeof useRiffs>["dispatch"];
  dispatchTab: ReturnType<typeof useTab>["dispatch"];
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: PropsWithChildren) => {
  const { songId = "" } = useParams();
  const { songsByArtist, recentSongs, dispatch: dispatchSongs } = useSongs();
  const {
    song,
    dispatch: dispatchSong,
    isPending: songIsPending,
  } = useSong(songId);
  const {
    riffs,
    riffTimes,
    dispatch: dispatchRiffs,
    isPending: riffsIsPending,
  } = useRiffs(songId);
  const {
    tab,
    dispatch: dispatchTab,
    isPending: tabIsPending,
  } = useTab(songId);

  // When needing to accept typed input, such as adding new riffs, I need to disable the keyboard shortcuts listener.
  // Since I want keyboard shortcuts to apply to the whole page (so I don't have to deal with focus issues), that listener prevents default which eats the keystrokes.
  // When these are disabled, I can type into the fields to add new riffs.
  // I don't see a need to have foot-controls enabled while adding a riff so I'm toggling it.
  const [disableShortcuts, setDisableShortcuts] = useState(false);

  const value = useMemo(
    () => ({
      song: song && songId !== song.id ? undefined : song,
      songIsPending,
      songsByArtist,
      riffs,
      riffsIsPending,
      riffTimes,
      tab,
      tabIsPending,
      recentSongs,
      disableShortcuts,
      setDisableShortcuts,
      dispatchSongs,
      dispatchSong,
      dispatchRiffs,
      dispatchTab,
    }),
    [
      songsByArtist,
      songIsPending,
      riffs,
      riffsIsPending,
      riffTimes,
      tab,
      tabIsPending,
      recentSongs,
      disableShortcuts,
      dispatchSongs,
      dispatchSong,
      dispatchRiffs,
      dispatchTab,
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
