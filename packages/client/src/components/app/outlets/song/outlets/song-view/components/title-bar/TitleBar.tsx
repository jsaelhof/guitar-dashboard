import { PlayArrow, Tune } from "@mui/icons-material";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Song } from "guitar-dashboard-types";
import SwitchButton from "../switch-button/SwitchButton";
import { useDocumentVisibility } from "./hooks/use-document-visibility";
import { post } from "../../../../../../utils/post";
import { Layout } from "./TitleBar.styles";

type TitleBarProps = {
  song: Song;
};

const TitleBar = ({ song }: TitleBarProps) => {
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
    <Layout>
      <div>
        <Typography variant="h5">{song.title}</Typography>

        {song.album && song.year && (
          // component="div" makes the display as block which fixes the height. Defualt span is too tall for some reason.
          <Typography variant="underline" component="div">
            {`${song.album} - ${song.year}`}
          </Typography>
        )}
      </div>

      <Button
        variant="stereo"
        onClick={() => play(song.id)}
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
    </Layout>
  ) : null;
};

export default TitleBar;
