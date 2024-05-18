import {
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

const SongList = () => {
  const navigate = useNavigate();
  const { songId, song, songs, songsByArtist, recentSongIds } = useAppContext();
  const initialSelectedArtist = song ? song.artist : undefined;

  const [selectedArtist, setSelectedArtist] = useState<string | undefined>(
    initialSelectedArtist
  );

  return songsByArtist ? (
    <>
      <List dense>
        <ListItem sx={{ p: 0, width: 1 }}>
          <List dense sx={{ py: 0, width: 1 }}>
            <ListSubheader color="primary" sx={{ lineHeight: 2, px: 0 }}>
              <ListItemButton
                onClick={() => {
                  setSelectedArtist(
                    selectedArtist !== "__RECENT__" ? "__RECENT__" : undefined
                  );
                }}
              >
                Recent Songs
              </ListItemButton>
            </ListSubheader>
            <Collapse in={selectedArtist === "__RECENT__"}>
              {recentSongIds.map((id) => (
                <ListItem key={id} sx={{ p: 0 }}>
                  <ListItemButton
                    sx={{ py: 0 }}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent this bubbling up and invoking the artist-level click.
                      navigate(`/${id}`);
                    }}
                    selected={id === songId}
                  >
                    <ListItemText
                      primary={songs[id].title}
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

        <Divider variant="middle" sx={{ my: 2 }} />

        {Object.entries(songsByArtist ?? []).map(([artist, songs]) => (
          <ListItem key={artist} sx={{ p: 0, width: 1 }}>
            <List dense sx={{ py: 0, width: 1 }}>
              <ListSubheader color="primary" sx={{ lineHeight: 2, px: 0 }}>
                <ListItemButton
                  onClick={() => {
                    setSelectedArtist(
                      artist !== selectedArtist ? artist : undefined
                    );
                    navigate(`/${songs[0].id}`);
                  }}
                >
                  {artist}
                </ListItemButton>
              </ListSubheader>
              <Collapse in={selectedArtist === artist}>
                {songs.map((song) => (
                  <ListItem key={song.id} sx={{ p: 0 }}>
                    <ListItemButton
                      sx={{ py: 0 }}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent this bubbling up and invoking the artist-level click.
                        navigate(`/${song.id}`);
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
      </List>
    </>
  ) : null;
};

export default SongList;
