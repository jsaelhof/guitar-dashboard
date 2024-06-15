import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import SongList from "./components/song-list/SongList";
import { DashboardLayout, LeftColumn } from "./Dashboard.styles";
import SongView from "./components/song-view/SongView";
import { ThemeProvider } from "@mui/material";
import { theme } from "./theme/theme";

function Dashboard() {
  return (
    <ThemeProvider theme={theme}>
      <DashboardLayout>
        <LeftColumn>
          <SongList />
        </LeftColumn>
        <SongView />
      </DashboardLayout>
    </ThemeProvider>
  );
}

export default Dashboard;
