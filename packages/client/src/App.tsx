import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { useNavigate, useParams } from "react-router-dom";
import SongList from "./components/song-list/SongList";
import Riffs from "./components/riffs/Riffs";
import SongControls from "./components/song-controls/SongControls";
import Player from "./components/player/Player";
import { useAppContext } from "./context/AppContext";
import { useRiffs } from "./hooks/use-riffs";
import { useState } from "react";
import AddRiff from "./components/add-riff/AddRiff";

function App() {
  const navigate = useNavigate();
  const { songId } = useParams();
  const { init, songs, songsByArtist } = useAppContext();
  const { riffs, riffTimes } = useRiffs(songId);

  // When adding new riffs, I need to disable the keyboard shortcuts listener.
  // Since I want it to apply to the whole page (so I don't have to deal with focus issues), that listener prevents default which eats the keystrokes.
  // When these are disabled, I can type into the fields to add new riffs.
  // I don't see a need to have foot-controls enabled while adding a riff so I'm toggling it.
  const [disableShortcuts, setDisableShortcuts] = useState(false);

  return !init ? null : (
    <div>
      <SongList
        initialSelectedArtist={songId ? songs[songId].artist : undefined}
        songsByArtist={songsByArtist}
        songs={songs}
        onClick={(song) => {
          navigate(`/${song.id}`);
        }}
      />

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
          <SongControls song={songs[songId]} />

          <Player
            song={songs[songId]}
            riffTimes={riffTimes}
            disableShortcuts={disableShortcuts}
          />

          {/* Display any associated riff data (images or data uris) */}
          {riffs && <Riffs song={songs[songId]} riffs={riffs} />}

          {/* FIXME: Look at PDF.js as a better solution */}
          {/* Display any PDF. This is typically used for non-pro tabs (old style ascii) as any easier option then cropping images. */}
          {songs[songId].pdf && (
            <embed
              src={`http://localhost:8001/${songs[songId].pdf}`}
              width="100%"
              type="application/pdf"
              style={{
                flexGrow: 1,
              }}
            />
          )}

          <AddRiff song={songs[songId]} onAdding={setDisableShortcuts} />
        </div>
      )}
    </div>
  );
}

export default App;
