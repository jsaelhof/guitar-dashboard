import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import SongList from "./components/song-list/SongList";
import { Layout, LeftColumn } from "./Song.styles";
import { AppProvider } from "./context/AppContext";
import { Outlet, useParams } from "react-router-dom";
import { useSongs } from "./hooks/use-songs";

function Song() {
  const { songId } = useParams();
  const songs = useSongs();

  return (
    <AppProvider>
      <Layout>
        <LeftColumn>
          <SongList {...songs} />
        </LeftColumn>
        <Outlet
          key={songId}
          context={{ dispatchSongs: songs.dispatch, songs }}
        />
      </Layout>
    </AppProvider>
  );
}

export default Song;
