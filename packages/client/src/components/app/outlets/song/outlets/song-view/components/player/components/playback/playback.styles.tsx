import styled from "@emotion/styled";
import { SliderRail, SliderThumb, SliderTrack } from "@mui/material";

export const Track = styled(SliderTrack)(({ theme: { palette, glows } }) => ({
  height: 2,
  backgroundColor: palette.blueLights[500],
  boxShadow: glows[1],
  border: "none",
}));

export const Rail = styled(SliderRail)(({ theme: { palette } }) => ({
  height: 6,
  backgroundColor: "black",
  borderBottom: `1px solid ${palette.lightGrey[500]}`,
}));

export const Thumb = styled(SliderThumb)<
  React.HTMLAttributes<HTMLSpanElement> & {
    "data-loop": boolean;
    // This is provided by MUI on each thumb (there can be multiple and there are 3 when a loop is set).
    // It defines which thumb this is.
    // In my case, we want to style the middle thumb (index 1 of 0,1,2) when there is a loop or 0 when there isn't.
    "data-index": number;
  }
>(
  ({
    theme: { palette, glows },
    "data-loop": dataLoop,
    "data-index": dataIndex,
  }) =>
    (dataLoop && dataIndex === 1) || !dataLoop
      ? {
          width: 2,
          height: 16,
          borderRadius: 2,
          backgroundColor: palette.blueLights[500],
          boxShadow: glows[2],
        }
      : {
          width: 0,
          pointerEvents: "none",
        }
);
