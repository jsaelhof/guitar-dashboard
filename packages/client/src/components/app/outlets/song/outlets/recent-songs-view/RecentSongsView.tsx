import { Layout, SongGrid, Title } from "./RecentSongsView.styles";
import { useOutletContext } from "react-router";
import { useSongs } from "../../hooks/use-songs";
import { RecentSongCard } from "./components/recent-song-card/RecentSongCard";
import { Typography } from "@mui/material";

const RecentSongsView = () => {
  const {
    songs: { recentSongs },
  } = useOutletContext<{ songs: ReturnType<typeof useSongs> }>();

  return (
    <Layout>
      <Title>
        <Typography variant="h5" sx={{ lineHeight: 1.2 }}>
          Recent Songs
        </Typography>
      </Title>

      <SongGrid>
        {recentSongs.map((song) => (
          <RecentSongCard key={song.id} song={song} />
        ))}
      </SongGrid>
    </Layout>
  );
};

export default RecentSongsView;
