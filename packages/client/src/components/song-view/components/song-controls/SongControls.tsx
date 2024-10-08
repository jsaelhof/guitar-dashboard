import { PlayArrow, Search } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { useCallback } from "react";
import { useAppContext } from "../../../../context/AppContext";

const SongControls = () => {
  const { song } = useAppContext();

  const play = useCallback((songId: string) => {
    fetch(`http://localhost:8001/play/${songId}`, { method: "post" });
  }, []);

  return song ? (
    <div
      // TODO: CLEAN UP ALL THE SX AND INLINE STYLES HERE
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto auto",
        alignItems: "center",
        gap: "16px",
        marginBottom: "16px",
      }}
    >
      <Box sx={{ ml: 1 }}>
        <Typography variant="h5" sx={{ lineHeight: 1.2 }}>
          {song.title}
        </Typography>
        <Typography
          sx={{ fontSize: 10 }}
          textTransform="uppercase"
          color={"GrayText"}
        >
          {`${song.album} - ${song.year}`}
        </Typography>
      </Box>
      <Button
        variant="contained"
        color="success"
        startIcon={<PlayArrow />}
        disabled={!song.file}
        onClick={() => play(song.id)}
      >
        Play on Desktop
      </Button>

      <Button
        variant="contained"
        startIcon={<Search />}
        onClick={() =>
          song.title || song.artist
            ? window.open(
                `https://www.ultimate-guitar.com/search.php?search_type=title&value=${encodeURIComponent(
                  `${song.title} ${song.artist}`
                )}`,
                "guitarTab"
              )
            : "https://www.ultimate-guitar.com"
        }
      >
        Search Tab
      </Button>
    </div>
  ) : null;
};

export default SongControls;
