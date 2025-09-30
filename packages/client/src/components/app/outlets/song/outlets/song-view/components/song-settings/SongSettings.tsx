import {
  Box,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Song } from "guitar-dashboard-types";
import { ChangeEventHandler, useCallback, useEffect } from "react";
import { useAppContext } from "../../../../context/AppContext";
import { SongAction } from "../../hooks/use-song";

export type SongSettings = {
  song: Song;
  dispatchSong: (
    action: Extract<SongAction, { type: "startOffset" | "startDelay" }>
  ) => void;
};

export const SongSettings = ({ song, dispatchSong }: SongSettings) => {
  const { setDisableShortcuts } = useAppContext();

  const onOffsetChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    ({ target }) => {
      const startOffset = target.value;
      if (startOffset === "" || /^[0-9]{0,3}$/.test(startOffset)) {
        dispatchSong({
          type: "startOffset",
          startOffset:
            startOffset == null || startOffset.length === 0
              ? undefined
              : parseInt(startOffset),
        });
      }
    },
    []
  );

  useEffect(() => {
    setDisableShortcuts(true);
    return () => setDisableShortcuts(false);
  }, []);

  const onToggleStartDelay = useCallback(() => {
    dispatchSong({ type: "startDelay", startDelay: !song.settings.startDelay });
  }, [dispatchSong, song.settings]);

  return (
    <Stack gap={4} width="fit-content">
      <Typography variant="body2">Song Settings</Typography>

      <FormGroup>
        <FormLabel>
          <Typography color="primary" fontWeight="bold">
            Count In
          </Typography>
        </FormLabel>
        <FormHelperText>
          Adds a count in when the song is played from the beginning.
        </FormHelperText>
        <Box mt={2}>
          <FormControlLabel
            control={
              <Switch
                defaultChecked
                color="success"
                checked={!!song.settings.startDelay}
                onChange={onToggleStartDelay}
              />
            }
            label="Enabled"
          />
        </Box>
      </FormGroup>

      <FormGroup>
        <Typography color="primary" fontWeight="bold">
          Start Offset
        </Typography>
        <FormHelperText>
          The number of seconds to skip when playing a song from the beginning.
          Useful for somgs with long intros.
        </FormHelperText>
        <Box mt={2}>
          <TextField
            placeholder="Add offset in seconds"
            value={song.settings.startOffset}
            onChange={onOffsetChange}
          />
        </Box>
      </FormGroup>
    </Stack>
  );
};
