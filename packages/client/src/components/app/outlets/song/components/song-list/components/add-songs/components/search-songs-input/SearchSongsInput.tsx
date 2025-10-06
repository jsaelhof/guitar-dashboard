import { Close, Search } from "@mui/icons-material";
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

  useEffect(() => {
    setDisableShortcuts(true);
    return () => setDisableShortcuts(false);
  }, []);

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
        <form
          id="search-songs"
          style={{
            display: "grid",
            gap: 16,
            width: "100%",
            paddingTop: 8,
          }}
          onSubmit={(e) => {
            e.preventDefault();
            dispatch({
              type: "search-song",
              search: song,
              artist,
              variousArtists,
            });
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
            onChange={({ target }) => setSong(target.value)}
            disabled={isPending}
          />

          <TextField
            variant="outlined"
            type="text"
            size="small"
            margin="none"
            label="Artist"
            value={artist}
            disabled={variousArtists || isPending}
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
            disabled={isPending}
          />
        </form>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center" }}>
        <Button
          form="search-songs"
          type="submit"
          variant="contained"
          color="primary"
          size="small"
          startIcon={<Search />}
          loading={isPending}
          loadingPosition="start"
          disabled={!song || (!artist && !variousArtists) || isPending}
        >
          Search
        </Button>
      </DialogActions>
    </>
  );
};

export default SearchSongsInput;
