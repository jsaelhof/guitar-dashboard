interface GlobalEventHandlersEventMap {
  updateTime: CustomEvent<{ currentTime: number }>;
  playSavedLoop: CustomEvent<{ label: string; loopA: number; loopB: number }>;
}
