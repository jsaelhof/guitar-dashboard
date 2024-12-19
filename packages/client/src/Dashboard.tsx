import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import SongList from "./components/song-list/SongList";
import { DashboardLayout, LeftColumn } from "./Dashboard.styles";
import { ThemeProvider } from "@mui/material";
import { theme } from "./theme/theme";
import { AppProvider } from "./context/AppContext";
import { Outlet, useParams } from "react-router-dom";
import { useSongs } from "./hooks/use-songs";

function Dashboard() {
  const { songId } = useParams();
  const songs = useSongs();

  return (
    <AppProvider>
      <ThemeProvider theme={theme}>
        <DashboardLayout>
          <LeftColumn>
            <SongList {...songs} />
          </LeftColumn>
          <Outlet key={songId} context={{ dispatchSongs: songs.dispatch }} />
        </DashboardLayout>
      </ThemeProvider>
    </AppProvider>
  );
}

export default Dashboard;
