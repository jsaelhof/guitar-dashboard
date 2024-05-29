import {
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

const SongList = () => {
  const navigate = useNavigate();
  const { songId = "" } = useParams();
  const { songsByArtist, recentSongs } = useAppContext();

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

  const [recentOpen, setRecentOpen] = useState(false);

  return (
    <>
      <List dense>
        <ListItem sx={{ p: 0, width: 1 }}>
          <List dense sx={{ py: 0, width: 1 }}>
            <ListSubheader color="primary" sx={{ lineHeight: 2, px: 0 }}>
              <ListItemButton
                onClick={() => {
                  setRecentOpen(!recentOpen);
                }}
              >
                Recent Songs
              </ListItemButton>
            </ListSubheader>
            <Collapse in={recentOpen}>
              {recentSongs.map(({ id, title, artist }) => (
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
                      primary={
                        <div>
                          <div>{title}</div>
                          <div style={{ fontSize: "0.8em", opacity: 0.66 }}>
                            {artist}
                          </div>
                        </div>
                      }
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

        {Object.entries(songsByArtist).map(([artist, songs]) => (
          <ListItem key={artist} sx={{ p: 0, width: 1 }}>
            <List dense sx={{ py: 0, width: 1 }}>
              <ListSubheader color="primary" sx={{ lineHeight: 2, px: 0 }}>
                <ListItemButton
                  onClick={() => {
                    navigate(`/${songs[0].id}`);
                  }}
                >
                  {artist}
                </ListItemButton>
              </ListSubheader>
              <Collapse in={currentArtist === artist}>
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
  );
};

export default SongList;
