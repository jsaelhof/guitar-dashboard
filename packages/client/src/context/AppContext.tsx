import { PropsWithChildren, createContext, useContext, useMemo } from "react";
import { Songs, SongsByArtist } from "../types";
import { SongUpdateDispatch, useSongsReducer } from "./hooks/useSongsReducer";

export type AppContextType = {
  init: boolean;
  songs: Songs;
  songsByArtist: SongsByArtist;
  dispatchSongUpdate: SongUpdateDispatch;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: PropsWithChildren) => {
  const { songs, songsByArtist, dispatchSongUpdate } = useSongsReducer();

  const value = useMemo(
    () => ({
      init: Object.keys(songs).length > 0,
      songs,
      songsByArtist,
      dispatchSongUpdate,
    }),
    [songs, songsByArtist, dispatchSongUpdate]
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
