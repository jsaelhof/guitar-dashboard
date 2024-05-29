import { useParams } from "react-router-dom";
import { Content, Header } from "./SongView.styles";
import SongControls from "./components/song-controls/SongControls";
import Player from "./components/player/Player";
import Riffs from "./components/riffs/Riffs";
import PDF from "./components/pdf/PDF";
import AddRiff from "./components/add-riff/AddRiff";

const SongView = () => {
  const { songId } = useParams();

  return (
    songId && (
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
    )
  );
};

export default SongView;
