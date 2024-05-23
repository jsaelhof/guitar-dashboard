import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Riff, Song, Songs, SongsByArtist } from "../types";
import { useParams } from "react-router-dom";
import { updateServer } from "../utils/update-server";
import { useRiffs } from "./hooks/use-riffs";
import { useRecentSongs } from "./hooks/use-recent-songs";
import { useSongs } from "./hooks/use-songs";

export type AppContextType = {
  init: boolean;
  songId: string;
  song: Song;
  songs: Songs;
  songsByArtist: SongsByArtist;
  riffs: Riff[];
  riffTimes: number[] | null;
  recentSongIds: string[];
  disableShortcuts: boolean;
  setDisableShortcuts: (disabled: boolean) => void;
  send: (scope: string, type: string, body?: Record<string, unknown>) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: PropsWithChildren) => {
  const { songId = "" } = useParams();
  //const { songs, songsByArtist, dispatchSongUpdate } = useSongsReducer();
  const { songs, songsByArtist, updateSongs } = useSongs();
  const { riffs, riffTimes, updateRiffs } = useRiffs(songId);
  const { recentSongIds, updateRecent } = useRecentSongs();

  type Response<TScope, TType, TData> = {
    error: boolean;
    scope: TScope;
    type: TType;
    data: TData;
  };

  const send = useCallback(
    async (scope: string, type: string, body?: Record<string, unknown>) => {
      const {
        response,
      }: {
        url: string;
        response:
          | Response<
              "riffs",
              "time" | "order" | "add",
              { songId: string; riffs: Riff[] }
            >
          | Response<"recent", "add", { recentSongIds: string[] }>
          | Response<"songs", "volume", { songs: Songs }>;
      } = await updateServer(`${scope}/${type}`, body);

      if (response.error) {
        console.error(response.error);
      } else {
        switch (response.scope) {
          case "songs":
            updateSongs(response.data.songs);
            break;
          case "riffs":
            updateRiffs(response.data.riffs);
            break;
          case "recent":
            updateRecent(response.data.recentSongIds);
            break;
        }
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
      init: Object.keys(songs).length > 0,
      songId,
      song: songs[songId],
      songs,
      songsByArtist,
      riffs,
      riffTimes,
      recentSongIds,
      disableShortcuts,
      setDisableShortcuts,
      send,
    }),
    [
      songId,
      songs,
      songsByArtist,
      riffs,
      riffTimes,
      recentSongIds,
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
