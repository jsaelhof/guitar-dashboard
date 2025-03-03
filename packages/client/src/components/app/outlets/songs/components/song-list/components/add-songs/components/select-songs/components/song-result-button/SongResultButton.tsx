import {
  Checkbox,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { CoverThumbnail, MissingCover } from "./SongResultButton.styles";
import { SearchSongResult } from "guitar-dashboard-types";
import { useCallback } from "react";
import { Block } from "@mui/icons-material";

export type SongResultButtonProps = {
  song: SearchSongResult;
  selected: boolean;
  onChange: (song: SearchSongResult) => void;
};

const SongResultButon = ({
  song,
  selected,
  onChange,
}: SongResultButtonProps) => {
  const { path, cover, album, title, existingId } = song;

  const onToggleSong = useCallback(() => onChange(song), [onChange, song]);

  return (
    <ListItemButton
      alignItems="center"
      onClick={onToggleSong}
      disabled={!!existingId}
    >
      <>
        <ListItemIcon sx={{ px: 1 }}>
          {!!existingId ? (
            <Block color="error" />
          ) : (
            <Checkbox
              edge="start"
              checked={selected}
              value={path}
              tabIndex={-1}
              sx={{ p: 0, ml: 0 }}
              disableRipple
            />
          )}
        </ListItemIcon>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          {cover ? (
            <CoverThumbnail src={cover} width={60} height={60} />
          ) : (
            <MissingCover />
          )}

          <ListItemText>
            <Typography variant="caption">{album}</Typography>
            <div>{title}</div>
          </ListItemText>
        </div>
      </>
    </ListItemButton>
  );
};

export default SongResultButon;
