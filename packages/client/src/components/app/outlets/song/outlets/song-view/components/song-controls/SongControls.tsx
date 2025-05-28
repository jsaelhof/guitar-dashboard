import { PlayArrow, Tune } from "@mui/icons-material";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Song } from "guitar-dashboard-types";
import SwitchButton from "../switch-button/SwitchButton";
import { useDocumentVisibility } from "./hooks/use-document-visibility";
import { post } from "../../../../../../utils/post";

type SongControlsProps = {
  song: Song;
};

// TODO: Rename... Probably something like top bar or page header
const SongControls = ({ song }: SongControlsProps) => {
  const play = useCallback((songId: string) => {
    post(`/play/${songId}`);
  }, []);

  const ampOn = useCallback(async () => {
    setAmpState("on");
    const response = await post("/amp/on");
    const { error } = (await response.json()) as { error: boolean };
    setAmpState(error ? "unknown" : "on");
  }, []);

  const ampOff = useCallback(async () => {
    setAmpState("off");
    const response = await post("/amp/off");
    const { error } = (await response.json()) as { error: boolean };
    setAmpState(error ? "unknown" : "off");
  }, []);

  const updateAmpStatus = useCallback(async () => {
    const response = await post("/amp/status");
    const state = ((await response.json()) as { state: boolean }).state;
    setAmpState(state ? "on" : "off");
  }, []);

  const [ampState, setAmpState] = useState<"on" | "off" | "unknown">("unknown");

  const isDocumentVisible = useDocumentVisibility();

  useEffect(() => {
    if (isDocumentVisible) {
      updateAmpStatus();
      const timeoutId = setInterval(updateAmpStatus, 10000);
      return () => clearInterval(timeoutId);
    }
  }, [isDocumentVisible]);

  return song ? (
    <div
      // TODO: CLEAN UP ALL THE SX AND INLINE STYLES HERE
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
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

      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "stretch",
          cursor: "pointer",
        }}
      >
        <Button
          variant="stereo"
          onClick={(e) => {
            e.stopPropagation();
            play(song.id);
          }}
          startIcon={<PlayArrow />}
        >
          Play on Desktop
        </Button>

        <Button
          onClick={() => (ampState === "on" ? ampOff() : ampOn())}
          variant="stereo"
          startIcon={<SwitchButton on={ampState === "on"} />}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <div>Guitar Amplifier</div>
            {/* When the amp is on, calling ampOn again will focus the amp. */}
            {ampState === "on" && (
              <IconButton
                color="blueLights"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  ampOn();
                }}
              >
                <Tune />
              </IconButton>
            )}
          </Box>
        </Button>
      </Box>
    </div>
  ) : null;
};

export default SongControls;
