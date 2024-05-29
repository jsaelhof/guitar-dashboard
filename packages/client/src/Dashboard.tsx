import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import SongList from "./components/song-list/SongList";
import { DashboardLayout, LeftColumn } from "./Dashboard.styles";
import SongView from "./components/song-view/SongView";

function Dashboard() {
  return (
    <DashboardLayout>
      <LeftColumn>
        <SongList />
      </LeftColumn>
      <SongView />
    </DashboardLayout>
  );
}

export default Dashboard;
