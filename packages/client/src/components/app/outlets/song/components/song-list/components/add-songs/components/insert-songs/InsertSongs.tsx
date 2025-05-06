import {
  Button,
  DialogActions,
  DialogTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Cancel, CheckCircle } from "@mui/icons-material";
import { InsertSongResult } from "guitar-dashboard-types";

export type InsertSongsProps = {
  addedSongs: Array<InsertSongResult>;
  onComplete: () => void;
};

const InsertSongs = ({ addedSongs, onComplete }: InsertSongsProps) => (
  <>
    <DialogTitle>
      <div>Songs Added</div>
    </DialogTitle>

    <List sx={{ px: 2 }}>
      {addedSongs.map(({ path, success }) => (
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
      <Button variant="contained" color="secondary" onClick={onComplete}>
        Ok
      </Button>
    </DialogActions>
  </>
);

export default InsertSongs;
