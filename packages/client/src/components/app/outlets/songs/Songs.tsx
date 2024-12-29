import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import SongList from "./components/song-list/SongList";
import { Layout, LeftColumn } from "./Songs.styles";
import { AppProvider } from "./context/AppContext";
import { Outlet, useParams } from "react-router-dom";
import { useSongs } from "./hooks/use-songs";

function Songs() {
  const { songId } = useParams();
  const songs = useSongs();

  return (
    <AppProvider>
      <Layout>
        <LeftColumn>
          <SongList {...songs} />
        </LeftColumn>
        <Outlet key={songId} context={{ dispatchSongs: songs.dispatch }} />
      </Layout>
    </AppProvider>
  );
}

export default Songs;
