import { styled } from "@mui/material";

export const Header = styled("div")(() => ({
  gridArea: "header",
  padding: 16,
  overflowY: "scroll",
}));

export const Content = styled("div")(() => ({
  gridArea: "content",
  padding: "0 16px 16px",
  overflowY: "scroll",
}));
