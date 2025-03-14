import { PlayArrow, Search, Tune } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Song } from "guitar-dashboard-types";
import { Amp } from "./SongControls.styles";

// SHOULD NOT BE BORROWING THESE FROM THE PLAYER COMPONENT.
// These should be lifted (probably all the knob/display/switch etc)
// Potentially SongControls needs to be merged with Player to form the "head"... Player remains a sub-component but the styling would be a cohesive "stereo component" stack.
import SwitchButton from "../player/components/switch-button/SwitchButton";
import { AmpLabel, DigitalButton } from "../player/Player.styles";
import { useDocumentVisibility } from "./hooks/use-document-visibility";
import { post } from "../../../../../../utils/post";

type SongControlsProps = {
  song: Song;
};

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

      <Amp
        onClick={() => (ampState === "on" ? ampOff() : ampOn())}
        style={{ cursor: "pointer" }}
      >
        <SwitchButton on={ampState === "on"} />
        <AmpLabel>Guitar Amplifier</AmpLabel>

        {/* When the amp is on, calling ampOn again will focus the amp. */}
        {ampState === "on" && (
          <DigitalButton
            size="small"
            sx={{ ml: 2 }}
            onClick={(e) => {
              e.stopPropagation();
              ampOn();
            }}
          >
            <Tune />
          </DigitalButton>
        )}
      </Amp>
    </div>
  ) : null;
};

export default SongControls;
