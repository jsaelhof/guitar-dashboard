export enum CustomEvents {
  "UPDATE_TIME" = "updateTime",
  "PLAY_SAVED_LOOP" = "playSavedLoop",
}

export type UpdateTimeDetail = { currentTime: number };
export type PlaySavedLoopDetail = {
  label: string;
  loopA: number;
  loopB: number;
};
