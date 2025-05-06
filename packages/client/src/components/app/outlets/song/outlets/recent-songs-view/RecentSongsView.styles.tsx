import { styled } from "@mui/material";

export const Layout = styled("div")(() => ({
  width: "100%",
  height: "100vh",
  display: "grid",
  gridTemplateRows: "auto minmax(auto,1fr)",
  gap: 16,
}));

export const Title = styled("div")(() => ({
  padding: 16,
}));

export const SongGrid = styled("div")(() => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(340px, 340px))",
  gridAutoRows: "max-content",
  width: "100%",
  gap: 16,
  minHeight: 0,
  overflow: "scroll",
  padding: 16,
}));
