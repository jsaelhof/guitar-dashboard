import {
  Box,
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  TextField,
} from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSongs } from "../../hooks/use-songs";
import { History, Search, Settings, Speed } from "@mui/icons-material";
import AddSongs from "./components/add-songs/AddSongs";
import { useAppContext } from "../../context/AppContext";
import { SongTitleList } from "guitar-dashboard-types";

export type SongListProps = ReturnType<typeof useSongs>;

const SongList = ({ recentSongs, songsByArtist, dispatch }: SongListProps) => {
  const navigate = useNavigate();
  const { songId = "" } = useParams();

  const currentArtist = useMemo(
    () =>
      songId
        ? Object.entries(songsByArtist).reduce<string | null>(
            (selectedArtist, [artist, songs]) => {
              if (songs.map(({ id }) => id).includes(songId))
                selectedArtist = artist;
              return selectedArtist;
            },
            null
          )
        : null,
    [songId, songsByArtist]
  );

  const { setDisableShortcuts } = useAppContext();

  const onInsert = useCallback(() => dispatch({ type: "get" }), []);

  const [search, setSearch] = useState("");

  return (
    <>
      <List dense sx={{ overflow: "auto", pt: 2, pb: 4 }}>
        <ListItem sx={{ p: 0, width: 1 }}>
          <ListItemButton
            sx={{ color: "primary.main" }}
            onClick={() => {
              navigate("/song");
            }}
          >
            <ListItemIcon>
              <History />
            </ListItemIcon>
            <ListItemText primary="Recent Songs" />
          </ListItemButton>
        </ListItem>

        <Divider variant="middle" sx={{ my: 2 }} />

        <ListItem>
          {/* Trigger containing the dialog for adding new songs */}
          <AddSongs onInsert={onInsert} />
        </ListItem>

        <ListItem sx={{ pb: 2 }}>
          <TextField
            variant="outlined"
            size="small"
            fullWidth
            placeholder="Search all songs"
            slotProps={{
              input: {
                startAdornment: <Search fontSize="small" sx={{ mr: 1 }} />,
                sx: {
                  fontSize: 12,
                },
              },
            }}
            onFocus={() => setDisableShortcuts(true)}
            onBlur={() => setDisableShortcuts(false)}
            onChange={({ target }) => setSearch(target.value)}
          ></TextField>
        </ListItem>

        {Object.entries(songsByArtist)
          .reduce<[string, SongTitleList][]>((acc, [artist, songs]) => {
            const filteredSongs = songs.filter(({ title }) =>
              title.toLowerCase().includes(search.toLowerCase())
            );
            if (filteredSongs.length) acc.push([artist, filteredSongs]);
            return acc;
          }, [] as [string, SongTitleList][])
          .map(([artist, songs]) => (
            <ListItem key={artist} sx={{ p: 0, width: 1 }}>
              <List dense sx={{ py: 0, width: 1 }}>
                <ListSubheader color="primary" sx={{ lineHeight: 2, px: 0 }}>
                  <ListItemButton
                    sx={{ py: 0.1 }}
                    onClick={() => {
                      navigate(`/song/${songs[0].id}`);
                    }}
                  >
                    <ListItemText
                      primaryTypographyProps={{
                        fontSize: 14,
                      }}
                    >
                      {artist}
                    </ListItemText>
                  </ListItemButton>
                </ListSubheader>
                <Collapse in={currentArtist === artist}>
                  {songs.map((song) => (
                    <ListItem key={song.id} sx={{ px: 0.5, py: 0 }}>
                      <ListItemButton
                        sx={{ py: 0 }}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent this bubbling up and invoking the artist-level click.
                          navigate(`/song/${song.id}`);
                        }}
                        selected={song.id === songId}
                      >
                        <ListItemText
                          primary={song.title}
                          primaryTypographyProps={{
                            fontSize: 12,
                          }}
                          sx={{ pl: 1 }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </Collapse>
              </List>
            </ListItem>
          ))}

        <Divider variant="middle" sx={{ my: 2 }} />

        <ListItem sx={{ p: 0, width: 1 }}>
          <ListItemButton
            sx={{ color: "primary.main" }}
            onClick={() => {
              navigate("/exercise");
            }}
          >
            <ListItemIcon>
              <Speed />
            </ListItemIcon>
            <ListItemText primary="Exercises" />
          </ListItemButton>
        </ListItem>

        <Divider variant="middle" sx={{ my: 2 }} />

        <ListItemButton onClick={() => navigate("settings")}>
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </ListItemButton>
      </List>
    </>
  );
};

export default SongList;
