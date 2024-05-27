import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { RecentSong, Riff, Song, Songs, SongsByArtist } from "../types";
import { useParams } from "react-router-dom";
import { updateServer } from "../utils/update-server";
import { useRiffs } from "./hooks/use-riffs";
import { useRecentSongs } from "./hooks/use-recent-songs";
import { useSongs } from "./hooks/use-songs";
import { useSong } from "./hooks/use-song";

export type AppContextType = {
  init: boolean;
  songId: string;
  song?: Song;
  songsByArtist: SongsByArtist;
  riffs: Riff[];
  riffTimes: number[] | null;
  recentSongs: RecentSong[];
  disableShortcuts: boolean;
  setDisableShortcuts: (disabled: boolean) => void;
  send: (scope: string, type: string, body?: Record<string, unknown>) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: PropsWithChildren) => {
  const { songId = "" } = useParams();
  const { songsReady, songsByArtist } = useSongs();
  const { song, dispatch: dispatchSong } = useSong(songId);
  const { riffs, riffTimes, dispatch: dispatchRiffs } = useRiffs(songId);
  const { recentSongs, dispatch: dispatchRecent } = useRecentSongs();

  type Response<TScope, TType, TData> = {
    error: boolean;
    scope: TScope;
    type: TType;
    data: TData;
  };

  const send = useCallback(
    // TODO: This should be an action type union interface.
    async (scope: string, type: string, body?: Record<string, unknown>) => {
      if (scope === "songs") {
        dispatchSong({
          type,
          ...body,
        });
        return;
      } else if (scope === "recent") {
        dispatchRecent({
          type,
          ...body,
        });
        return;
      } else if (scope === "riffs") {
        dispatchRiffs({
          type,
          ...body,
        });
        return;
      }
    },
    []
  );

  // When needing to accept typed input, such as adding new riffs, I need to disable the keyboard shortcuts listener.
  // Since I want keyboard shortcuts to apply to the whole page (so I don't have to deal with focus issues), that listener prevents default which eats the keystrokes.
  // When these are disabled, I can type into the fields to add new riffs.
  // I don't see a need to have foot-controls enabled while adding a riff so I'm toggling it.
  const [disableShortcuts, setDisableShortcuts] = useState(false);

  const value = useMemo(
    () => ({
      init: songsReady,
      songId,
      song,
      songsByArtist,
      riffs,
      riffTimes,
      recentSongs,
      disableShortcuts,
      setDisableShortcuts,
      send,
    }),
    [
      songId,
      songsByArtist,
      riffs,
      riffTimes,
      recentSongs,
      disableShortcuts,
      send,
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
