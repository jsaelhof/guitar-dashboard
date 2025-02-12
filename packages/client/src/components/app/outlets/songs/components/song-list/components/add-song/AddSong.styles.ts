import { styled } from "@mui/material";

export const Layout = styled("div")(() => ({
  display: "grid",
  gap: 16,
  width: "100%",
}));

export const DropTarget = styled("div")(({ theme: { palette } }) => ({
  textAlign: "center",
  border: "1px solid grey",
  borderRadius: 8,
  borderStyle: "dashed",
  padding: "32px 8px",

  "&:hover": {
    background: palette.blueLights[300],
  },
}));

export const ButtonLayout = styled("div")(() => ({
  display: "flex",
  gap: 16,
}));
