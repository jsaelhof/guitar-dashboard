import { styled } from "@mui/material";

export const Header = styled("div")(() => ({
  gridArea: "header",
  padding: 16,
  overflowY: "scroll",
}));

export const Content = styled("div")(() => ({
  gridArea: "content",
  display: "grid",
  gridTemplateColumns: "auto 1fr",
  gap: 16,
  minHeight: 0,
}));

export const TabPanel = styled("div")(() => ({
  padding: "0 16px 16px",
  overflowY: "scroll",
}));
