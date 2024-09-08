import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import SongList from "./components/song-list/SongList";
import { DashboardLayout, LeftColumn } from "./Dashboard.styles";
import { ThemeProvider } from "@mui/material";
import { theme } from "./theme/theme";
import { AppProvider } from "./context/AppContext";
import { Outlet } from "react-router-dom";

function Dashboard() {
  return (
    <AppProvider>
      <ThemeProvider theme={theme}>
        <DashboardLayout>
          <LeftColumn>
            <SongList />
          </LeftColumn>
          <Outlet />
        </DashboardLayout>
      </ThemeProvider>
    </AppProvider>
  );
}

export default Dashboard;
