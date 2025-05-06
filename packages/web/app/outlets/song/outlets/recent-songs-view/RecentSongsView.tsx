import { useOutletContext } from "react-router";
import { useSongs } from "../../hooks/use-songs";
import { RecentSongCard } from "./components/recent-song-card/RecentSongCard";
import { ScrollArea } from "~/components/ui/scroll-area";

const RecentSongsView = () => {
  const {
    songs: { recentSongs },
  } = useOutletContext<{ songs: ReturnType<typeof useSongs> }>();

  console.log(recentSongs);

  return (
    <div className="w-full h-svh grid grid-rows-[50px_minmax(auto,1fr)] px-8 py-2">
      <div>
        <h1 className="text-2xl font-bold">Recent Songs</h1>
      </div>

      <ScrollArea className="overflow-y-auto">
        <div className="grid grid-cols-[repeat(auto-fill,340px))] w-full gap-4">
          {recentSongs.map((song) => (
            <RecentSongCard key={song.id} song={song} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default RecentSongsView;
