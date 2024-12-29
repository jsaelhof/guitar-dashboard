export const formatSeconds = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = `${time - minutes * 60}`.padStart(2, "0");
  return `${minutes}:${seconds}`;
};
