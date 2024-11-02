import { PlayArrow, Search, Speaker } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { useCallback } from "react";
import { Song } from "guitar-dashboard-types";

type SongControlsProps = {
  song: Song;
};

const SongControls = ({ song }: SongControlsProps) => {
  const play = useCallback((songId: string) => {
    fetch(`http://localhost:8001/play/${songId}`, { method: "post" });
  }, []);

  const launchAmp = useCallback(() => {
    fetch("http://localhost:8001/launch/amp", { method: "post" });
  }, []);

  return song ? (
    <div
      // TODO: CLEAN UP ALL THE SX AND INLINE STYLES HERE
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto auto auto",
        alignItems: "center",
        gap: "16px",
        marginBottom: "16px",
      }}
    >
      <Box sx={{ ml: 1 }}>
        <Typography variant="h5" sx={{ lineHeight: 1.2 }}>
          {song.title}
        </Typography>
        {song.album && song.year && (
          <Typography
            sx={{ fontSize: 10 }}
            textTransform="uppercase"
            color={"GrayText"}
          >
            {`${song.album} - ${song.year}`}
          </Typography>
        )}
      </Box>

      <Button
        variant="contained"
        color="error"
        startIcon={<Speaker />}
        onClick={() => launchAmp()}
      >
        Guitar Rig
      </Button>

      <Button
        variant="contained"
        color="success"
        startIcon={<PlayArrow />}
        disabled={!song.file}
        onClick={() => play(song.id)}
      >
        IINA
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
