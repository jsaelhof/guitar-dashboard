import { styled } from "@mui/material";

export const Layout = styled("div")(() => ({
  display: "flex",
  gap: 16,
  flexDirection: "column",
  alignItems: "center",
  marginTop: 32,
  fontWeight: "bold",
  fontSize: "1.2rem",
}));

export const Controls = styled("div")(() => ({
  display: "flex",
  gap: 24,
  width: "fit-content",
}));
