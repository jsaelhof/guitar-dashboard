import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { useNavigate, useParams } from "react-router-dom";
import SongList from "./components/song-list/SongList";
import Riffs from "./components/riffs/Riffs";
import SongControls from "./components/song-controls/SongControls";
import { useSongs } from "./hooks/use-songs";
import { useRiffs } from "./hooks/use-riffs";
import Player from "./components/player/Player";

function App() {
  const navigate = useNavigate();
  const { songId } = useParams();
  const { songs, songsByArtist } = useSongs();
  const riffs = useRiffs();

  return !songs ? null : (
    <div style={{ display: "grid", gridTemplateColumns: "300px 1fr" }}>
      <SongList
        initialSelectedArtist={songId ? songs[songId].artist : ""}
        songsByArtist={songsByArtist}
        onClick={(song) => {
          navigate(`/${song.id}`);
        }}
      />

      {songId && (
        <div
          style={{
            backgroundColor: "rgba(0,0,0,0.03)",
            padding: 16,
            minHeight: "100vh",
          }}
        >
          <SongControls song={songs[songId]} />

          <Player file={songs[songId].file} />

          {/* Display any associated riff data (images or data uris) */}
          <Riffs riffs={riffs} />

          {/* FIXME: Look at PDF.js as a better solution */}
          {/* Display any PDF. This is typically used for non-pro tabs (old style ascii) as any easier option then cropping images. */}
          {songs[songId].pdf && (
            <embed
              src={`http://localhost:8001/${songs[songId].pdf}`}
              width="100%"
              height="90%" // Quick and dirty... really need a flexbox solution
              type="application/pdf"
            ></embed>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
