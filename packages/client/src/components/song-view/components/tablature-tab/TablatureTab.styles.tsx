import { styled } from "@mui/material";

export const Label = styled("div")(() => ({
  fontSize: 10,
  textTransform: "none",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
}));
