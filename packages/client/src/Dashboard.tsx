import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { useParams } from "react-router-dom";
import SongList from "./components/song-list/SongList";
import Riffs from "./components/riffs/Riffs";
import SongControls from "./components/song-controls/SongControls";
import Player from "./components/player/Player";
import { useAppContext } from "./context/AppContext";
import AddRiff from "./components/add-riff/AddRiff";
import PDF from "./components/pdf/PDF";
import {
  Content,
  DashboardLayout,
  Header,
  LeftColumn,
} from "./Dashboard.styles";

function Dashboard() {
  const { songId } = useParams();
  const { init } = useAppContext();

  return !init ? null : (
    <DashboardLayout>
      <LeftColumn>
        <SongList />
      </LeftColumn>

      {songId && (
        <>
          <Header>
            <SongControls />
            <Player />
          </Header>

          <Content>
            {/* Display any associated riff data (images or data uris) */}
            <Riffs />
            <PDF />
            <AddRiff />
          </Content>
        </>
      )}
    </DashboardLayout>
  );
}

export default Dashboard;
