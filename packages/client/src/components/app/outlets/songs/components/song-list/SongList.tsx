import {
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSongs } from "../../hooks/use-songs";
import { History, LibraryMusicOutlined, Speed } from "@mui/icons-material";
import AddSongs from "./components/add-songs/AddSongs";

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

  const [recentOpen, setRecentOpen] = useState(false);

  const onInsert = useCallback(() => dispatch({ type: "get" }), []);

  return (
    <>
      <List dense sx={{ overflow: "auto" }}>
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

        <ListItem sx={{ p: 0, width: 1 }}>
          <List dense sx={{ py: 0, width: 1 }}>
            <ListSubheader color="primary" sx={{ lineHeight: 2, px: 0 }}>
              <ListItemButton
                onClick={() => {
                  setRecentOpen(!recentOpen);
                }}
              >
                <ListItemIcon>
                  <History />
                </ListItemIcon>
                <ListItemText primary="Recent Songs" />
              </ListItemButton>
            </ListSubheader>
            <Collapse in={recentOpen}>
              {recentSongs.map(({ id, title, artist }) => (
                <ListItem key={id} sx={{ p: 0 }}>
                  <ListItemButton
                    sx={{ py: 0 }}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent this bubbling up and invoking the artist-level click.
                      navigate(`/song/${id}`);
                    }}
                    selected={id === songId}
                  >
                    <ListItemText
                      primary={
                        <div>
                          <div>{title}</div>
                          <div style={{ fontSize: "0.9em", opacity: 0.66 }}>
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

        <ListItem sx={{ lineHeight: 2, pb: 2 }}>
          <ListItemIcon>
            <LibraryMusicOutlined />
          </ListItemIcon>
          <ListItemText
            primary="Songs"
            primaryTypographyProps={{ color: "primary" }}
          />

          {/* Trigger containing the dialog for adding new songs */}
          <AddSongs onInsert={onInsert} />
        </ListItem>

        {Object.entries(songsByArtist).map(([artist, songs]) => (
          <ListItem key={artist} sx={{ p: 0, width: 1 }}>
            <List dense sx={{ py: 0, width: 1 }}>
              <ListSubheader color="primary" sx={{ lineHeight: 2, px: 0 }}>
                <ListItemButton
                  onClick={() => {
                    navigate(`/song/${songs[0].id}`);
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
      </List>
    </>
  );
};

export default SongList;
