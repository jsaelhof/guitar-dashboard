import {
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { Song, SongsByArtist } from "../../types";
import { useState } from "react";

export type SongListProps = {
  initialSelectedArtist?: string;
  songsByArtist: SongsByArtist | null;
  onClick: (song: Song) => void;
};

const SongList = ({
  initialSelectedArtist,
  songsByArtist,
  onClick,
}: SongListProps) => {
  const { songId } = useParams();

  const [selectedArtist, setSelectedArtist] = useState<string | undefined>(
    initialSelectedArtist
  );

  return songsByArtist ? (
    <div
      style={{
        height: "100vh",
        width: "300px",
        overflowY: "scroll",
        position: "fixed",
      }}
    >
      <List dense>
        {Object.entries(songsByArtist ?? []).map(([artist, songs]) => (
          <ListItem key={artist} sx={{ p: 0, width: 1 }}>
            <List dense sx={{ py: 0, width: 1 }}>
              <ListSubheader color="primary" sx={{ lineHeight: 2, px: 0 }}>
                <ListItemButton
                  onClick={() => {
                    setSelectedArtist(
                      artist !== selectedArtist ? artist : undefined
                    );
                    onClick(songs[0]);
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
                        onClick(song);
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
    </div>
  ) : null;
};

export default SongList;
