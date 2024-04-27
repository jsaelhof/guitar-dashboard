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
  initialSelectedArtist: string;
  songsByArtist: SongsByArtist | null;
  onClick: (song: Song) => void;
};

const SongList = ({
  initialSelectedArtist,
  songsByArtist,
  onClick,
}: SongListProps) => {
  const { songId } = useParams();

  const [selectedArtist, setSelectedArtist] = useState<string>(
    initialSelectedArtist
  );

  return songsByArtist ? (
    <List dense>
      {Object.entries(songsByArtist ?? []).map(([artist, songs]) => (
        <ListItem
          key={artist}
          sx={{ px: 0, width: 1 }}
          onClick={() => {
            setSelectedArtist(artist);
            onClick(songs[0]);
          }}
        >
          <List dense sx={{ py: 0, width: 1 }}>
            <ListSubheader color="primary" sx={{ lineHeight: 2 }}>
              {artist}
            </ListSubheader>
            <Collapse in={selectedArtist === artist}>
              {songs.map((song) => (
                <ListItem key={song.id} sx={{ p: 0 }}>
                  <ListItemButton
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent this bubbling up and invoking the artist-level click.
                      onClick(song);
                    }}
                    selected={song.id === songId}
                  >
                    <ListItemText primary={song.title} sx={{ pl: 1 }} />
                  </ListItemButton>
                </ListItem>
              ))}
            </Collapse>
          </List>
        </ListItem>
      ))}
    </List>
  ) : null;
};

export default SongList;
