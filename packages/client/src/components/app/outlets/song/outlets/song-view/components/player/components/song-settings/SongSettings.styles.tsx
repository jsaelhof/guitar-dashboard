import { Popover, styled } from "@mui/material";

export const SettingsPopover = styled(Popover)(({ theme: { palette } }) => ({
  color: palette.lightGrey[200],
  fontFamily: "StereoGothic",
  fontWeight: 400,
  textTransform: "uppercase",
  fontSize: 8,

  "&&": {
    "& .MuiPaper-root": {
      minWidth: 200,
      background: `linear-gradient(${palette.darkGrey[500]} 0%, ${palette.darkGrey[880]} 100%)`,
      boxShadow: "inset 0 5px 15px #00000099",
      border: `1px solid ${palette.lightGrey[900]}`,
    },
  },
}));
