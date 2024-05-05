import { SliderThumb, styled } from "@mui/material";

export const PlayheadThumb = styled(SliderThumb)(() => ({
  width: 2,
  borderRadius: 2,
}));

export const LoopThumb = styled(SliderThumb)(() => ({
  width: 0,
}));
