import { Stack, Typography } from "@mui/material";
import { Song } from "guitar-dashboard-types";
import { useEffect } from "react";
import { useAppContext } from "../../../../context/AppContext";
import { SongAction } from "../../hooks/use-song";
import { TablatureSettings } from "./components/tablature-settings/TablatureSettings";
import { StartOffsetSetting } from "./components/start-offset-setting/StartOffsetSetting";
import { CountInSetting } from "./components/count-in-setting/CountInSetting";

export type SongSettings = {
  song: Song;
  dispatchSong: (action: SongAction) => void;
};

export const SongSettings = ({ song, ...props }: SongSettings) => {
  const { setDisableShortcuts } = useAppContext();

  useEffect(() => {
    setDisableShortcuts(true);
    return () => setDisableShortcuts(false);
  }, []);

  return (
    <Stack gap={4} width="fit-content">
      <Typography variant="body2">Song Settings</Typography>

      <CountInSetting startDelay={song.settings.startDelay} {...props} />

      <StartOffsetSetting startOffset={song.settings.startOffset} {...props} />

      <TablatureSettings tablature={song.tablature} {...props} />
    </Stack>
  );
};
