import {
  Box,
  FormGroup,
  FormHelperText,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEventHandler, useCallback } from "react";
import { SongAction } from "../../../../hooks/use-song";
import { Song } from "guitar-dashboard-types";

export type StartOffsetSettingProps = {
  startOffset: Song["settings"]["startOffset"];
  dispatchSong: (action: Extract<SongAction, { type: "startOffset" }>) => void;
};

export const StartOffsetSetting = ({
  startOffset,
  dispatchSong,
}: StartOffsetSettingProps) => {
  const onOffsetChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    ({ target }) => {
      const newOffset = target.value;
      if (newOffset === "" || /^[0-9]{0,3}$/.test(newOffset)) {
        dispatchSong({
          type: "startOffset",
          startOffset:
            newOffset == null || newOffset.length === 0
              ? undefined
              : parseInt(newOffset),
        });
      }
    },
    [],
  );

  return (
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
          value={startOffset}
          onChange={onOffsetChange}
        />
      </Box>
    </FormGroup>
  );
};
