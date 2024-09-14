// Defines my custom events so that addEventListener allows the name.
declare global {
  interface DocumentEventMap {
    [CustomEvents.PLAY_SAVED_LOOP]: CustomEvent<PlaySavedLoopDetail>;
    [CustomEvents.UPDATE_TIME]: CustomEvent<UpdateTimeDetail>;
  }
}

export enum CustomEvents {
  "UPDATE_TIME" = "updateTime",
  "PLAY_SAVED_LOOP" = "playSavedLoop",
}

export type UpdateTimeDetail = {
  currentTime: number;
  totalTime: number;
  percentPlayed: number;
};
export type PlaySavedLoopDetail = {
  label: string;
  loopA: number;
  loopB: number;
};
