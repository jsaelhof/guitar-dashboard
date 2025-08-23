import { PlaylistAdd } from "@mui/icons-material";
import { Box, Divider, Tab, Tabs, Typography } from "@mui/material";
import { Fragment, useEffect, useRef, useState } from "react";
import { Content, Header, TabPanel } from "./SongView.styles";
import AddTablature from "./components/add-tablature/AddTablature";
import PDF from "./components/pdf/PDF";
import Player from "./components/player/Player";
import TitleBar from "./components/title-bar/TitleBar";
import Tablature from "./components/tablature/Tablature";
import TablatureTab from "./components/tablature-tab/TablatureTab";
import Video from "./components/video/Video";
import { useSong } from "./hooks/use-song";
import { useOutletContext, useParams } from "react-router-dom";
import { SongsAction } from "../../hooks/use-songs";
import { CustomEvents, UpdateTimeDetail } from "./types/events";
import { StereoLight } from "../../../../components/stereo-light/StereoLight";

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

  // useEffect(() => {
  //   if (song && !song.tablature?.length && !!song.riffs?.length) {
  //     setNavTabId(1);
  //   }
  // }, [song]);

  const scrollRef = useRef<HTMLDivElement>(null);

  // This hook sets up a listener for playback events from the the Player.tsx component as it plays through a song.
  // Using the time, we can check and see what riff should be shown.
  useEffect(() => {
    const listener = ({
      detail: { currentTime, totalTime, percentPlayed },
    }: CustomEvent<UpdateTimeDetail>) => {
      if (scrollRef.current) {
        const p = Math.max(currentTime - 30, 0) / (totalTime - 60);
        const maxScroll = Math.round(
          scrollRef.current.scrollHeight -
            scrollRef.current.getBoundingClientRect().height
        );

        scrollRef.current.scrollTo({ top: maxScroll * p, behavior: "instant" });
      }
    };

    document.addEventListener(CustomEvents.UPDATE_TIME, listener);
    () => document.removeEventListener(CustomEvents.UPDATE_TIME, listener);
  }, []);

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
              <Tab
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    <StereoLight $on={!!song.tablature?.length} />
                    <div>Tab</div>
                  </Box>
                }
              />
              {/* <Tab label="Riffs" /> */}
              <Tab
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    <StereoLight $on={!!song.videos?.length} />
                    <div>Video</div>
                  </Box>
                }
              />
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

          <TabPanel ref={scrollRef}>
            {navTabId === 0 && (
              <>
                {song.pdf ? (
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
              </>
            )}

            {/* {navTabId === 1 && (
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
            )} */}

            {navTabId === 1 && (
              <Video videos={song.videos} dispatchSong={dispatchSong} />
            )}
          </TabPanel>
        </Content>
      </Fragment>
    )
  );
};

export default SongView;
