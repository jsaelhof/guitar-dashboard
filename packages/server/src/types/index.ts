import { Song } from "guitar-dashboard-types";

export type UserSongData = Pick<Song, "id" | "metrics" | "settings" | "loops">;
