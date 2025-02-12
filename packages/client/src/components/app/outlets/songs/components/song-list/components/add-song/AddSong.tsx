import { Add } from "@mui/icons-material";
import { Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import Dropzone from "react-dropzone";
import { ButtonLayout, DropTarget, Layout } from "./AddSong.styles";
import { useSearchSongs } from "./hooks/use-search-songs";

const AddSong = () => {
  const { result, dispatch, isPending } = useSearchSongs();
  const [filesToSearch, setFIlesToSearch] = useState<File[]>();
  const [hint, setHint] = useState<string>("");

  console.log({ result });

  return (
    <Dropzone onDrop={setFIlesToSearch}>
      {({ getRootProps, getInputProps }) => (
        <Layout>
          {!filesToSearch && (
            <DropTarget {...getRootProps()}>
              <input {...getInputProps()} />
              <Typography variant="caption">
                Drop MP3 files / Click to choose
              </Typography>
            </DropTarget>
          )}

          {filesToSearch && !isPending && !result && (
            <>
              <Typography variant="caption">
                {filesToSearch.map((file) => (
                  <div key={file.name}>{file.name}</div>
                ))}
              </Typography>
              <div>
                <TextField
                  variant="standard"
                  type="text"
                  size="small"
                  margin="none"
                  placeholder="First letter of Band"
                  autoFocus
                  value={hint}
                  onChange={({ currentTarget }) =>
                    setHint(currentTarget.value.charAt(0).toUpperCase())
                  }
                />
              </div>
              <ButtonLayout>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Add />}
                  size="small"
                  onClick={() => {
                    dispatch({
                      type: "search-songs",
                      names: filesToSearch.map(({ name }) => name),
                      hint: hint,
                    });
                  }}
                >
                  Add
                </Button>

                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    setFIlesToSearch(undefined);
                    setHint("");
                  }}
                  size="small"
                >
                  Clear
                </Button>
              </ButtonLayout>
            </>
          )}

          {isPending && <div>Searching...</div>}

          {!isPending && result && filesToSearch && (
            <div>
              <Typography variant="caption">
                {filesToSearch.map((searchedFile) => (
                  <div style={{ marginBottom: 12 }}>
                    <div>{searchedFile.name}</div>
                    {result.files
                      .filter((file) => file.endsWith(searchedFile.name))
                      .map((resultFile) => (
                        <div key={resultFile}>
                          {resultFile.split("/").slice(-2).join("/")}
                        </div>
                      ))}
                  </div>
                ))}
              </Typography>
            </div>
          )}
        </Layout>
      )}
    </Dropzone>
  );
};

export default AddSong;
