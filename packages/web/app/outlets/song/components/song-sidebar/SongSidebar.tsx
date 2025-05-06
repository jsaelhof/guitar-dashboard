import { useCallback, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useSongs } from "../../hooks/use-songs";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
} from "~/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { CirclePlusIcon, Gauge, History, ListMusic } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";

export type SongSidebarProps = ReturnType<typeof useSongs>;

const SongSidebar = ({
  // recentSongs,
  songsByArtist,
  dispatch,
}: SongSidebarProps) => {
  const navigate = useNavigate();
  const { songId = "" } = useParams();

  const currentArtist = useMemo(
    () =>
      songId
        ? Object.entries(songsByArtist).reduce<string | null>(
            (selectedArtist, [artist, songs]) => {
              if (songs.map(({ id }) => id).includes(songId))
                selectedArtist = artist;
              return selectedArtist;
            },
            null
          )
        : null,
    [songId, songsByArtist]
  );

  // const [recentOpen, setRecentOpen] = useState(false);

  const onInsert = useCallback(() => dispatch({ type: "get" }), []);

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuButton onClick={() => navigate("/exercise")}>
            <Gauge />
            <span className="text-xs">Exercises</span>
          </SidebarMenuButton>
          <SidebarMenuButton onClick={() => navigate("/song")}>
            <History />
            <span className="text-xs">Recent Songs</span>
          </SidebarMenuButton>
        </SidebarMenu>
      </SidebarHeader>

      {/* <Separator />

      <SidebarContent>
        <Collapsible open={recentOpen} className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger onClick={() => setRecentOpen(!recentOpen)}>
                <History className="mr-2" />
                <span>Recent Songs</span>
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <CollapsibleContent>
                <SidebarMenu>
                  {recentSongs.map(({ id, title, artist }) => (
                    <SidebarMenuItem key={id}>
                      <SidebarMenuButton
                        className="min-h-7 h-auto py-1"
                        onClick={() => navigate(`/song/${id}`)}
                        isActive={id === songId}
                      >
                        <div>
                          <div>{title}</div>
                          <div className="text-xs opacity-66">{artist}</div>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </CollapsibleContent>
            </SidebarGroupContent>
          </SidebarGroup>
        </Collapsible> */}

      <Separator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="mb-2">
            <ListMusic className="mr-2" />
            <span>Songs</span>
            <Button variant="ghost" color="secondary" className="ml-auto">
              <CirclePlusIcon />
            </Button>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {Object.entries(songsByArtist).map(([artist, songs]) => (
                <Collapsible
                  open={currentArtist === artist}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        onClick={() => {
                          navigate(`/song/${songs[0].id}`);
                        }}
                      >
                        {artist}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {songs.map((song) => (
                          <SidebarMenuSubButton
                            key={song.id}
                            className="min-h-7 h-auto py-1"
                            isActive={song.id === songId}
                            onClick={() => navigate(`/song/${song.id}`)}
                          >
                            {song.title}
                          </SidebarMenuSubButton>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default SongSidebar;
