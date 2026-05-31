import {
  Box,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Switch,
  Typography,
} from "@mui/material";
import { Song } from "guitar-dashboard-types";
import { useCallback } from "react";
import { SongAction } from "../../../../hooks/use-song";

export type CountInSettingProps = {
  startDelay: Song["settings"]["startDelay"];
  dispatchSong: (action: Extract<SongAction, { type: "startDelay" }>) => void;
};

export const CountInSetting = ({
  startDelay,
  dispatchSong,
}: CountInSettingProps) => {
  const onToggleStartDelay = useCallback(() => {
    dispatchSong({ type: "startDelay", startDelay: !startDelay });
  }, [dispatchSong, startDelay]);

  return (
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
              checked={!!startDelay}
              onChange={onToggleStartDelay}
            />
          }
          label="Enabled"
        />
      </Box>
    </FormGroup>
  );
};
