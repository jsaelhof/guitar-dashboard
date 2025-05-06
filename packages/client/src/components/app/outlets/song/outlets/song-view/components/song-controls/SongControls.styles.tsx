import { styled } from "@mui/material";

export const Amp = styled("div")(({ theme: { palette } }) => ({
  display: "flex",
  alignItems: "center",
  border: "1px solid black",
  borderRadius: 6,
  height: "100%",
  gap: 4,
  padding: "0 16px",
  background: `linear-gradient(${palette.darkGrey[500]} 0%, ${palette.darkGrey[880]} 100%)`,
}));
