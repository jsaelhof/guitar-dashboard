import { PlayArrow, QueueMusic } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import { useCallback } from "react";
import { useAppContext } from "../../context/AppContext";

const SongControls = () => {
  const { song } = useAppContext();

  const play = useCallback((songId: string) => {
    fetch(`http://localhost:8001/play/${songId}`, { method: "post" });
  }, []);

  return song ? (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto auto",
        alignItems: "center",
        gap: "16px",
        marginBottom: "24px",
      }}
    >
      <Typography variant="h5" sx={{ ml: 1 }}>
        {song.title}
      </Typography>
      <Button
        variant="contained"
        color="success"
        startIcon={<PlayArrow />}
        disabled={!song.file}
        onClick={() => play(song.id)}
      >
        Play Song
      </Button>

      <Button
        variant="contained"
        startIcon={<QueueMusic />}
        onClick={() => window.open(song.tab, "guitarTab")}
        disabled={!song.tab}
      >
        Full Tab
      </Button>
    </div>
  ) : null;
};

export default SongControls;
