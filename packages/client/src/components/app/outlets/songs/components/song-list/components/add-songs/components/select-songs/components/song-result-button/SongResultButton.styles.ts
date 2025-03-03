import { styled } from "@mui/material";

export const CoverThumbnail = styled("img")(() => ({
  borderRadius: 4,
  overflow: "hidden",
  boxSizing: "border-box",
  border: "1px solid #242424",
}));

export const MissingCover = styled("div")(() => ({
  boxSizing: "border-box",
  border: "1px solid #242424",
  background: "lightgrey",
  width: 60,
  height: 60,
  borderRadius: 4,
  overflow: "hidden",
}));
