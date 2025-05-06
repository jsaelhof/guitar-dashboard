import { Card } from "@mui/material";
import type { RecentSong } from "guitar-dashboard-types";
import {
  CardActionAreaLayout,
  Cover,
  Muted,
  SongTitle,
} from "./RecentSongCard.styles";
import { useNavigate } from "react-router-dom";

interface RecentSongCardProps {
  song: RecentSong;
}

export const RecentSongCard = ({ song }: RecentSongCardProps) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardActionAreaLayout onClick={() => navigate(`/song/${song.id}`)}>
        <Cover>{song.cover && <img src={song.cover} />}</Cover>
        <div>
          <SongTitle>{song.title}</SongTitle>
          <Muted>{song.artist}</Muted>
        </div>
      </CardActionAreaLayout>
    </Card>
  );
};
