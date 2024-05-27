import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
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
  const { init } = useAppContext();
  const { song } = useAppContext();

  return !init ? null : (
    <DashboardLayout>
      <LeftColumn>
        <SongList />
      </LeftColumn>

      {song && (
        // TODO: Since all this needs "Song", I could wrap this all up as a Song component and move it's data out of context into that component and start passing it in to each subcomponent.
        // I'd need to think a bit about how to update the server state if there is no context.
        <>
          <Header>
            <SongControls />
            <Player />
          </Header>

          <Content>
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
