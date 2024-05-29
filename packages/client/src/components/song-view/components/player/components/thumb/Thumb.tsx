import { PropsWithChildren } from "react";
import { LoopThumb, PlayheadThumb } from "./Thumb.styles";

const ThumbComponent = (props: PropsWithChildren) => {
  // If data-loop is true, there are 3 thumbs (0: loop start, 1: current time, 2: loop end)
  // If data-loop is false, there is only 1 thumb for the current time.
  // I want to style the current time differently than the loop thumbs.
  return (props["data-loop"] && props["data-index"] === 1) ||
    !props["data-loop"] ? (
    <PlayheadThumb {...props} />
  ) : (
    <LoopThumb {...props} />
  );
};

export default ThumbComponent;
