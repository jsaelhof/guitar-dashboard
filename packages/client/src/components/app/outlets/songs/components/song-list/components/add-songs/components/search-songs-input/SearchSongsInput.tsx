import { Close, HourglassBottom, Search } from "@mui/icons-material";
import {
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  TextField,
} from "@mui/material";
import { useAppContext } from "../../../../../../context/AppContext";
import { useSearchSong } from "../../hooks/use-search-song";
import { useEffect, useState } from "react";
import { SearchSongResults } from "guitar-dashboard-types";

export type SearchSongsInputProps = {
  onComplete: (searchResults: SearchSongResults) => void;
  onClose: () => void;
};

const SearchSongsInput = ({ onComplete, onClose }: SearchSongsInputProps) => {
  const { setDisableShortcuts } = useAppContext();

  const [artist, setArtist] = useState("");
  const [song, setSong] = useState("");
  const [variousArtists, setVariousArtists] = useState(false);

  const { dispatch, result, isPending } = useSearchSong();

  useEffect(() => result && onComplete(result), [onComplete, result]);

  return (
    <>
      <DialogTitle
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <div>Search for Songs</div>
        <IconButton size="small" onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <div
          style={{
            display: "grid",
            gap: 16,
            width: "100%",
            paddingTop: 8,
          }}
        >
          <TextField
            variant="outlined"
            type="text"
            size="small"
            margin="none"
            label="Song"
            autoFocus
            value={song}
            onFocus={() => setDisableShortcuts(true)}
            onBlur={() => setDisableShortcuts(false)}
            onChange={({ target }) => setSong(target.value)}
          />

          <TextField
            variant="outlined"
            type="text"
            size="small"
            margin="none"
            label="Artist"
            value={artist}
            disabled={variousArtists}
            onFocus={() => setDisableShortcuts(true)}
            onBlur={() => setDisableShortcuts(false)}
            onChange={({ target }) => setArtist(target.value)}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={variousArtists}
                onChange={({ target }: React.ChangeEvent<HTMLInputElement>) =>
                  setVariousArtists(target.checked)
                }
              />
            }
            label="Various Artists"
          />
        </div>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center" }}>
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<Search />}
          loading={isPending}
          loadingPosition="start"
          disabled={!song || (!artist && !variousArtists) || isPending}
          onClick={() =>
            dispatch({
              type: "search-song",
              search: song,
              artist,
              variousArtists,
            })
          }
        >
          Search
        </Button>
      </DialogActions>
    </>
  );
};

export default SearchSongsInput;
