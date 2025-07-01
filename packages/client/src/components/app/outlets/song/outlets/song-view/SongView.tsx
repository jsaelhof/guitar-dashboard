import { PlaylistAdd } from "@mui/icons-material";
import { Divider, Tab, Tabs } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { Content, Header, TabPanel } from "./SongView.styles";
import AddRiffCard from "./components/add-riff-card/AddRiffCard";
import AddTablature from "./components/add-tablature/AddTablature";
import PDF from "./components/pdf/PDF";
import Player from "./components/player/Player";
import Riffs from "./components/riffs/Riffs";
import TitleBar from "./components/title-bar/TitleBar";
import Tablature from "./components/tablature/Tablature";
import TablatureTab from "./components/tablature-tab/TablatureTab";
import Video from "./components/video/Video";
import { useSong } from "./hooks/use-song";
import { useOutletContext, useParams } from "react-router-dom";
import { SongsAction } from "../../hooks/use-songs";

const SongView = () => {
  const { songId = "" } = useParams();

  const {
    song,
    dispatch: dispatchSong,
    isPending: songIsPending,
  } = useSong(songId);

  const { dispatchSongs } = useOutletContext<{
    dispatchSongs: (action: SongsAction) => void;
  }>();

  const [navTabId, setNavTabId] = useState(0);
  const onTabChange = (_, activeTab: number) => setNavTabId(activeTab);

  const [tablatureTabId, setTablatureTabId] = useState(0);
  const onTablatureTabChange = (_, activeTab: number) =>
    setTablatureTabId(activeTab);

  useEffect(() => {
    if (song && !song.tablature?.length && !!song.riffs?.length) {
      setNavTabId(1);
    }
  }, [song]);

  return (
    song?.id && (
      <Fragment key={songId}>
        <Header>
          <TitleBar song={song} />
          <Player
            song={song}
            dispatchSong={dispatchSong}
            dispatchSongs={dispatchSongs}
          />
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
            {navTabId === 0 && (song.tablature ?? []).length > 0 && (
              <>
                <Divider variant="middle" style={{ margin: "24px" }} />

                <Tabs
                  value={tablatureTabId}
                  orientation="vertical"
                  onChange={onTablatureTabChange}
                >
                  {(song.tablature ?? []).map((props) => (
                    <TablatureTab key={props.id} {...props} />
                  ))}
                  <Tab label={<PlaylistAdd />} />
                </Tabs>
              </>
            )}
          </div>

          <TabPanel>
            {navTabId === 0 && song.pdf ? (
              <PDF pdf={song.pdf} />
            ) : song.tablature && tablatureTabId < song.tablature.length ? (
              <Tablature tablature={song.tablature[tablatureTabId]} />
            ) : (
              <AddTablature
                mode="tab"
                song={song}
                dispatchSong={dispatchSong}
                songIsPending={songIsPending}
              />
            )}

            {navTabId === 1 && (
              <>
                <Riffs
                  songId={song.id}
                  riffs={song.riffs}
                  dispatchSong={dispatchSong}
                />
                <AddRiffCard
                  mode="riffs"
                  dispatchSong={dispatchSong}
                  songIsPending={songIsPending}
                />
              </>
            )}

            {navTabId === 2 && (
              <Video videos={song.videos} dispatchSong={dispatchSong} />
            )}
          </TabPanel>
        </Content>
      </Fragment>
    )
  );
};

export default SongView;
