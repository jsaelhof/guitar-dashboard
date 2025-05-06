// import { PlaylistAdd } from "@mui/icons-material";
// import { Divider, Tab, Tabs } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
// import AddRiffCard from "./components/add-riff-card/AddRiffCard";
// import AddTablature from "./components/add-tablature/AddTablature";
// import PDF from "./components/pdf/PDF";
// import Player from "./components/player/Player";
// import Riffs from "./components/riffs/Riffs";
// import SongControls from "./components/song-controls/SongControls";
// import Tablature from "./components/tablature/Tablature";
// import TablatureTab from "./components/tablature-tab/TablatureTab";
// import Video from "./components/video/Video";
import { useSong } from "./hooks/use-song";
import { useOutletContext, useParams } from "react-router";
import { type SongsAction } from "../../hooks/use-songs";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Separator } from "~/components/ui/separator";
import { ListMusic } from "lucide-react";

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

  const [navTabId, setNavTabId] = useState("tab");
  const onTabChange = (activeTab: string) => setNavTabId(activeTab);

  const [tablatureTabId, setTablatureTabId] = useState(0);
  const onTablatureTabChange = (activeTab: string) =>
    setTablatureTabId(parseInt(activeTab));

  useEffect(() => {
    if (song && !song.tablature?.length && !!song.riffs?.length) {
      setNavTabId("riffs");
    }
  }, [song]);

  return (
    song?.id && (
      <Fragment key={songId}>
        <div className="p-4 overflow-y-scroll">
          {/* <SongControls song={song} /> */}
          {/* <Player
            song={song}
            dispatchSong={dispatchSong}
            dispatchSongs={dispatchSongs}
          /> */}
        </div>

        <div className="grid grid-cols-[auto_1fr] gap-4 min-h-0">
          <div className="min-w-[75px]">
            <Tabs
              value={navTabId}
              orientation="vertical"
              onValueChange={onTabChange}
            >
              <TabsList className="grid grid-flow-row h-full w-full">
                {[
                  { value: "tab", label: "Tab" },
                  { value: "riffs", label: "Riffs" },
                  { value: "video", label: "Video" },
                ].map(({ value, label }) => (
                  <TabsTrigger
                    key={value}
                    value={value}
                    className="p-3 uppercase"
                  >
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {/* Only show the secondary tabs if this is the "tablature" tab and there is at least one tablature set up. */}
            {navTabId === "tab" && (song.tablature ?? []).length > 0 && (
              <>
                <Separator className="my-4" />

                <Tabs
                  value={tablatureTabId.toString()}
                  orientation="vertical"
                  onValueChange={onTablatureTabChange}
                >
                  <TabsList className="grid grid-flow-row w-full h-full">
                    {(song.tablature ?? []).map((props) => (
                      <TabsTrigger value={props.id} className="flex-col p-3">
                        <ListMusic />
                        <span className="text-xs">{props.label}</span>
                      </TabsTrigger>
                      // <TablatureTab key={props.id} {...props} />
                    ))}
                    <TabsTrigger value="addTab" className="p-3">
                      +
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </>
            )}
          </div>

          <div>
            {navTabId === "tab" &&
              (song.tablature && tablatureTabId < song.tablature.length ? (
                // <Tablature tablature={song.tablature[tablatureTabId]} />
                <div>Tablature</div>
              ) : (
                // <AddTablature
                //   mode="tab"
                //   song={song}
                //   dispatchSong={dispatchSong}
                //   songIsPending={songIsPending}
                // />
                <div>Add Tablature</div>
              ))}

            {navTabId === "riffs" && (
              <>
                {/* <Riffs
                  songId={song.id}
                  riffs={song.riffs}
                  dispatchSong={dispatchSong}
                /> */}
                <div>Riffs</div>
                {/* <AddRiffCard
                  mode="riffs"
                  dispatchSong={dispatchSong}
                  songIsPending={songIsPending}
                /> */}
                <div>Add Riff</div>
              </>
            )}

            {navTabId === "video" && (
              // <Video videos={song.videos} dispatchSong={dispatchSong} />
              <div>Video</div>
            )}
          </div>

          {/* <PDF pdf={song.pdf} /> */}
        </div>
      </Fragment>
    )
  );
};

export default SongView;
