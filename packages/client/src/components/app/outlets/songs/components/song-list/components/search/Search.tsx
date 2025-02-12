import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { Search as SearchIcon } from "@mui/icons-material";
import { useSearchSong } from "./hooks/use-search-song";

const Search = () => {
  const [search, setSearch] = useState<string>("");
  const [artist, setArtist] = useState<string>("");

  const { result, dispatch, isPending } = useSearchSong();

  console.log({ result });

  return (
    <div style={{ display: "grid", gap: 16, width: "100%" }}>
      <TextField
        variant="outlined"
        type="text"
        size="small"
        margin="none"
        label="Song"
        autoFocus
        value={search}
        onChange={({ target }) => setSearch(target.value)}
      />

      <TextField
        variant="outlined"
        type="text"
        size="small"
        margin="none"
        label="Artist"
        value={artist}
        onChange={({ target }) => setArtist(target.value)}
      />

      <Button
        variant="contained"
        color="primary"
        size="small"
        startIcon={<SearchIcon />}
        disabled={isPending}
        onClick={() => dispatch({ type: "search-song", search, artist })}
      >
        Search
      </Button>
    </div>
  );
};

export default Search;
