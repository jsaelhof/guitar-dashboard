import type { RecentSong } from "guitar-dashboard-types";
import { Card, CardContent } from "~/components/ui/card";

interface RecentSongCardProps {
  song: RecentSong;
}

export const RecentSongCard = ({ song }: RecentSongCardProps) => {
  return (
    <Card className="hover:bg-accent/50 transition-colors w-85 p-2">
      <div className="flex items-top gap-4">
        <div className="w-20 h-20 min-w-20 rounded-sm border border-gray-700 overflow-hidden bg-black">
          {song.cover && (
            <img src={song.cover} className="w-full h-full object-cover" />
          )}
        </div>
        <div className="flex flex-col">
          <h3 className="font-semibold">{song.title}</h3>
          <p className="text-sm text-muted-foreground">{song.artist}</p>
        </div>
      </div>
    </Card>
  );
};
