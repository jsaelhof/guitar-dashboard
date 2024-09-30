// Defines my custom events so that addEventListener allows the name.
declare global {
  interface DocumentEventMap {
    [CustomEvents.UPDATE_TIME]: CustomEvent<UpdateTimeDetail>;
  }
}

export enum CustomEvents {
  "UPDATE_TIME" = "updateTime",
}

export type UpdateTimeDetail = {
  currentTime: number;
  totalTime: number;
  percentPlayed: number;
};
