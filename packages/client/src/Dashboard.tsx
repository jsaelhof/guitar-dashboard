import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { useParams } from "react-router-dom";
import SongList from "./components/song-list/SongList";
import Riffs from "./components/riffs/Riffs";
import SongControls from "./components/song-controls/SongControls";
import Player from "./components/player/Player";
import { useAppContext } from "./context/AppContext";
import AddRiff from "./components/add-riff/AddRiff";
import PDF from "./components/pdf/PDF";

function Dashboard() {
  const { songId } = useParams();
  const { init } = useAppContext();

  return !init ? null : (
    <div>
      <SongList />

      {songId && (
        <div
          style={{
            backgroundColor: "rgba(0,0,0,0.03)",
            padding: 16,
            minHeight: "calc(100vh - 32px)",
            marginLeft: 300,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <SongControls />
          <Player />
          {/* Display any associated riff data (images or data uris) */}
          <Riffs />
          <PDF />
          <AddRiff />
        </div>
      )}
    </div>
  );
}

export default Dashboard;
