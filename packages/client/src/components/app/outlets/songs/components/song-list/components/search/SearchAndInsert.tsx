import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import {
  Add,
  Cancel,
  CheckCircle,
  Close,
  Search as SearchIcon,
} from "@mui/icons-material";
import { useSearchSong } from "./hooks/use-search-song";
import { useAppContext } from "../../../../context/AppContext";
import { CoverThumbnail, MissingCover } from "./SearchAndInsert.styles";
import { useInsertSongs } from "./hooks/use-insert-songs";
import { SearchSongResult } from "guitar-dashboard-types";

export type SearchAndInsertProps = {
  onInsert: () => void;
};

// TODO: Break up components here
// TODO: Add a button to open the search form instead of leaving it open all the time?
// TODO: Search results should indicate if the song is already in the DB! Maybe show it as already added?

const SearchAndInsert = ({ onInsert }: SearchAndInsertProps) => {
  const { setDisableShortcuts } = useAppContext();
  const [search, setSearch] = useState<string>("");
  const [artist, setArtist] = useState<string>("");

  const { result, dispatch, isPending } = useSearchSong();
  const [selectedFiles, setSelectedFiles] = useState<Array<SearchSongResult>>(
    []
  );

  const {
    result: insertResult,
    dispatch: insertDispatch,
    isPending: insertIsPending,
  } = useInsertSongs();

  useEffect(() => {
    if (!!insertResult) {
      console.log("REFRESH");
      onInsert();
    }
  }, [insertResult]);

  const resetSearch = useCallback(() => {
    setSearch("");
    setArtist("");
    setSelectedFiles([]);
    dispatch({ type: "reset" });
    insertDispatch({ type: "reset" });
  }, []);

  return (
    <>
      <div style={{ display: "grid", gap: 16, width: "100%" }}>
        <TextField
          variant="outlined"
          type="text"
          size="small"
          margin="none"
          label="Song"
          autoFocus
          value={search}
          onFocus={() => setDisableShortcuts(true)}
          onBlur={() => setDisableShortcuts(false)}
          onChange={({ target }) => setSearch(target.value)}
        />

        <TextField
          variant="outlined"
          type="text"
          size="small"
          margin="none"
          label="Artist"
          value={artist}
          onFocus={() => setDisableShortcuts(true)}
          onBlur={() => setDisableShortcuts(false)}
          onChange={({ target }) => setArtist(target.value)}
        />

        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<SearchIcon />}
          disabled={!artist || isPending}
          onClick={() => dispatch({ type: "search-song", search, artist })}
        >
          Search
        </Button>
      </div>

      <Dialog open={!!result && !insertResult}>
        <DialogTitle
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <div>Search Results</div>
          <IconButton size="small" onClick={resetSearch}>
            <Close />
          </IconButton>
        </DialogTitle>

        {result &&
          Object.entries(result).map(([artist, albums]) => (
            <List sx={{ px: 3 }}>
              <Typography variant="overline">{artist}</Typography>
              {Object.values(albums).map((songs) =>
                songs.map(({ cover, ...searchSongResult }) => (
                  <ListItemButton
                    key={searchSongResult.path}
                    alignItems="flex-start"
                    onClick={() =>
                      setSelectedFiles((state) =>
                        state.find(({ path }) => path === searchSongResult.path)
                          ? [
                              ...state.filter(
                                ({ path }) => path !== searchSongResult.path
                              ),
                            ]
                          : [...state, searchSongResult]
                      )
                    }
                  >
                    <>
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={
                            !!selectedFiles.find(
                              ({ path }) => path === searchSongResult.path
                            )
                          }
                          value={searchSongResult.path}
                          tabIndex={-1}
                          disableRipple
                        />
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
                          <Typography variant="caption">
                            {searchSongResult.album}
                          </Typography>
                          <div>{searchSongResult.title}</div>
                        </ListItemText>
                      </div>
                    </>
                  </ListItemButton>
                ))
              )}
            </List>
          ))}

        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            startIcon={<Add />}
            variant="contained"
            color="secondary"
            disabled={insertIsPending || selectedFiles.length === 0}
            onClick={() =>
              insertDispatch({ type: "insert-songs", files: selectedFiles })
            }
          >
            Add Songs
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!insertResult} maxWidth="xl">
        <DialogTitle>
          <div>Songs Added</div>
        </DialogTitle>

        <List sx={{ px: 2 }}>
          {(insertResult ?? []).map(({ path, success }) => (
            <ListItem key={path}>
              <ListItemIcon>
                {success ? (
                  <CheckCircle color="success" />
                ) : (
                  <Cancel color="error" />
                )}
              </ListItemIcon>
              <ListItemText>{path}</ListItemText>
            </ListItem>
          ))}
        </List>

        <DialogActions sx={{ justifyContent: "center" }}>
          <Button variant="contained" color="secondary" onClick={resetSearch}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SearchAndInsert;
