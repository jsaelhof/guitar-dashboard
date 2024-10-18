import { PlaylistAdd } from "@mui/icons-material";
import { Button, Divider, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { Content, Header, TabPanel } from "./SongView.styles";
import AddRiffCard from "./components/add-riff-card/AddRiffCard";
import AddRiff from "./components/add-riff/AddRiff";
import PDF from "./components/pdf/PDF";
import Player from "./components/player/Player";
import Riffs from "./components/riffs/Riffs";
import SongControls from "./components/song-controls/SongControls";
import Tablature from "./components/tablature/Tablature";
import TablatureTab from "./components/tablature-tab/TablatureTab";
import Video from "./components/video/Video";

const SongView = () => {
  const { tab, song } = useAppContext();

  const [navTabId, setNavTabId] = useState(0);
  const onTabChange = (_, activeTab: number) => setNavTabId(activeTab);

  const [tablatureTabId, setTablatureTabId] = useState(0);
  const onTablatureTabChange = (_, activeTab: number) =>
    setTablatureTabId(activeTab);

  return (
    song?.id && (
      <>
        <Header>
          <SongControls />
          <Player />
        </Header>

        <Content>
          <div>
            <Tabs
              value={navTabId}
              orientation="vertical"
              onChange={onTabChange}
            >
              <Tab label="Tab" />
              <Tab label="Riffs" />
              <Tab label="Video" />
            </Tabs>

            {/* Only show the secondary tabs if this is the "tablature" tab and there is at least one tablature set up. */}
            {navTabId === 0 && tab.length > 0 && (
              <>
                <Divider variant="middle" style={{ margin: "24px" }} />

                <Tabs
                  value={tablatureTabId}
                  orientation="vertical"
                  onChange={onTablatureTabChange}
                >
                  {tab.map(TablatureTab)}
                  <Tab label={<PlaylistAdd />} />
                </Tabs>
              </>
            )}
          </div>

          <TabPanel>
            <div>
              {navTabId === 0 &&
                (tablatureTabId < tab.length ? (
                  <Tablature tablature={tab[tablatureTabId]} />
                ) : (
                  <AddRiff mode="tab" />
                ))}

              {navTabId === 1 && (
                <>
                  <Riffs />
                  <AddRiffCard mode="riffs" />
                </>
              )}

              {navTabId === 2 && <Video videos={song.videos} />}
            </div>

            <PDF />
          </TabPanel>
        </Content>
      </>
    )
  );
};

export default SongView;
