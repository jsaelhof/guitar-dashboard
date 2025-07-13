import { ArrowDropDown } from "@mui/icons-material";
import { IconButton, ListItem, ListItemText, Typography } from "@mui/material";
import { MouseEvent, useCallback, useState } from "react";
import { Light } from "../../Player.styles";
import { SettingsPopover } from "./SongSettings.styles";
import { Song } from "guitar-dashboard-types";
import { SongAction } from "../../../../hooks/use-song";

export type SongSettingsProps = {
  settings: Song["settings"];
  dispatch: (action: SongAction) => void;
};

const SongSettings = ({ settings, dispatch }: SongSettingsProps) => {
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);

  const onTrigger = useCallback(
    ({ currentTarget }: MouseEvent<HTMLButtonElement>) => {
      setAnchor(currentTarget);
    },
    []
  );

  const onClose = () => {
    setAnchor(null);
  };

  const onToggleStartDelay = useCallback(() => {
    dispatch({ type: "startDelay", startDelay: !settings.startDelay });
  }, [dispatch, settings]);

  return (
    <>
      <IconButton size="small" color="blueLights" onClick={onTrigger}>
        <ArrowDropDown />
      </IconButton>

      <SettingsPopover
        open={!!anchor}
        anchorEl={anchor}
        onClose={onClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <ListItem
          sx={{
            display: "flex",
            justifyContent: "space-between",
            cursor: "pointer",
          }}
          onClick={onToggleStartDelay}
        >
          <ListItemText>
            <Typography variant="stereo">Delayed Start</Typography>
          </ListItemText>
          <Light $on={settings.startDelay} $size="large" />
        </ListItem>
      </SettingsPopover>
    </>
  );
};

export default SongSettings;
