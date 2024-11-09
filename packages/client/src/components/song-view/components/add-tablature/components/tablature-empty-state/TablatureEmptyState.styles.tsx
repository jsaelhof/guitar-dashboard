import { styled } from "@mui/material";

export const Layout = styled("div")(() => ({
  display: "grid",
  justifyItems: "center",
  justifyContent: "center",
  alignItems: "center",
  gridTemplateColumns: "max-content max-content",
  padding: 16,
  paddingLeft: 0,
  gap: 16,
  margin: "auto 0",
}));
