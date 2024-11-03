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

type SongControlsProps = {
  song: Song;
};

const SongControls = ({ song }: SongControlsProps) => {
  const play = useCallback((songId: string) => {
    fetch(`http://localhost:8001/play/${songId}`, { method: "post" });
  }, []);

  const ampOn = useCallback(async () => {
    setAmpState("on");
    const response = await fetch("http://localhost:8001/amp/on", {
      method: "post",
    });
    const { error } = (await response.json()) as { error: boolean };
    console.log("on", { error });
    setAmpState(error ? "unknown" : "on");
  }, []);

  const ampOff = useCallback(async () => {
    setAmpState("off");
    const response = await fetch("http://localhost:8001/amp/off", {
      method: "post",
    });
    const { error } = (await response.json()) as { error: boolean };
    console.log("off", { error });
    setAmpState(error ? "unknown" : "off");
  }, []);

  const updateAmpStatus = useCallback(async () => {
    const response = await fetch("http://localhost:8001/amp/status", {
      method: "post",
    });
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
        gridTemplateColumns: "1fr auto 1fr",
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

      <div style={{ display: "flex", gap: 16, justifyContent: "end" }}>
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
    </div>
  ) : null;
};

export default SongControls;
