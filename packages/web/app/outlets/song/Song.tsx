// import SongList from "./components/song-list/SongList";

import { AppProvider } from "./context/AppContext";
import { useSongs } from "./hooks/use-songs";
import { Outlet, useParams } from "react-router";
import { SidebarProvider } from "~/components/ui/sidebar";
import SongSidebar from "./components/song-sidebar/SongSidebar";

const Song = () => {
  const { songId } = useParams();
  const songs = useSongs();

  return (
    <AppProvider>
      <SidebarProvider
        style={{
          "--sidebar-width": "20rem",
          "--sidebar-width-mobile": "20rem",
        }}
      >
        <SongSidebar {...songs} />
        <Outlet
          key={songId}
          context={{ dispatchSongs: songs.dispatch, songs }}
        />
      </SidebarProvider>
    </AppProvider>
  );
};

export default Song;
