import { Add } from "@mui/icons-material";
import { Dialog, IconButton } from "@mui/material";
import { useCallback, useState } from "react";
import SearchSongsInput from "./components/search-songs-input/SearchSongsInput";
import { InsertSongResult, SearchSongResults } from "guitar-dashboard-types";
import SelectSongs from "./components/select-songs/SelectSongs";
import InsertSongs from "./components/insert-songs/InsertSongs";

export type AddSongsProps = {
  onInsert: () => void;
};

const AddSongs = ({ onInsert }: AddSongsProps) => {
  const [open, setOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchSongResults>();
  const [addedSongs, setAddedSongs] = useState<Array<InsertSongResult>>();

  const onClose = useCallback(() => {
    setOpen(false);
    setSearchResults(undefined);
    setAddedSongs(undefined);
  }, []);

  const onComplete = useCallback(() => {
    onClose();
    onInsert();
  }, [onClose, onInsert]);

  return (
    <>
      <IconButton size="small" color="primary" onClick={() => setOpen(true)}>
        <Add />
      </IconButton>

      <Dialog open={open} maxWidth="sm" fullWidth>
        {!searchResults && (
          <SearchSongsInput onComplete={setSearchResults} onClose={onClose} />
        )}

        {searchResults && !addedSongs && (
          <SelectSongs
            results={searchResults}
            onComplete={setAddedSongs}
            onClose={onClose}
          />
        )}

        {addedSongs && (
          <InsertSongs addedSongs={addedSongs} onComplete={onComplete} />
        )}
      </Dialog>
    </>
  );
};

export default AddSongs;
