import { Add, Close } from "@mui/icons-material";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  Typography,
} from "@mui/material";
import {
  InsertSongResult,
  SearchSongResult,
  SearchSongResults,
} from "guitar-dashboard-types";
import { useCallback, useEffect, useState } from "react";
import SongResultButon from "./components/song-result-button/SongResultButton";
import { useInsertSongs } from "../../hooks/use-insert-songs";

type SelectSongsProps = {
  results?: SearchSongResults;
  onClose: () => void;
  onComplete: (addedSongs: Array<InsertSongResult>) => void;
};

const SelectSongs = ({ results, onClose, onComplete }: SelectSongsProps) => {
  const [selectedFiles, setSelectedFiles] = useState<Array<SearchSongResult>>(
    []
  );

  const { result, dispatch, isPending } = useInsertSongs();

  useEffect(() => {
    result && onComplete(result);
  }, [result]);

  const onAdd = useCallback(
    () =>
      selectedFiles.length &&
      dispatch({ type: "insert-songs", files: selectedFiles }),
    [dispatch, selectedFiles]
  );

  const onToggleSong = useCallback(
    (searchSongResult: SearchSongResult) =>
      setSelectedFiles((state) =>
        state.find(({ path }) => path === searchSongResult.path)
          ? [...state.filter(({ path }) => path !== searchSongResult.path)]
          : [...state, searchSongResult]
      ),
    []
  );

  return (
    <>
      <DialogTitle
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <div>Search Results</div>
        <IconButton size="small" onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      {results && Object.keys(results).length > 0 ? (
        <>
          {Object.entries(results).map(([artist, albums]) => (
            <List sx={{ px: 3 }}>
              <Typography variant="overline">{artist}</Typography>
              {Object.values(albums).map((songs) =>
                songs.map((searchSongResult) => (
                  <SongResultButon
                    key={searchSongResult.path}
                    song={searchSongResult}
                    selected={
                      // TODO: Is there a better way to know which file is selected directly?
                      !!selectedFiles.find(
                        ({ path }) => path === searchSongResult.path
                      )
                    }
                    onChange={onToggleSong}
                  />
                ))
              )}
            </List>
          ))}

          <DialogActions sx={{ justifyContent: "center" }}>
            <Button
              startIcon={<Add />}
              variant="contained"
              color="secondary"
              disabled={selectedFiles.length === 0}
              onClick={onAdd}
              loading={isPending}
              loadingPosition="start"
            >
              Add Songs
            </Button>
          </DialogActions>
        </>
      ) : (
        <>
          <DialogContent>
            <div>No songs found.</div>
          </DialogContent>

          <DialogActions sx={{ justifyContent: "center" }}>
            <Button
              size="small"
              variant="contained"
              color="secondary"
              onClick={onClose}
            >
              Ok
            </Button>
          </DialogActions>
        </>
      )}
    </>
  );
};

export default SelectSongs;
