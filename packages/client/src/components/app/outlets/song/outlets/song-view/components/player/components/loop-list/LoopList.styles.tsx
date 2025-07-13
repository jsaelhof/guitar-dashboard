import { IconButton, Popover, styled } from "@mui/material";

export const LoopsPopover = styled(Popover)(({ theme: { palette } }) => ({
  "&&": {
    "& .MuiPaper-root": {
      fontFamily: "Circular",
      color: palette.lightGrey[200],
      background: `linear-gradient(${palette.darkGrey[500]} 0%, ${palette.darkGrey[880]} 100%)`,
      boxShadow: "inset 0 5px 15px #00000099",
      padding: 12,
      margin: 0,
      border: `1px solid ${palette.lightGrey[900]}`,
    },
  },
}));

export const Layout = styled("div")(({ theme: { palette } }) => ({
  display: "grid",
  gridTemplateColumns: "minmax(150px, 1fr) auto auto",
  gap: 8,
}));

export const LoopTrigger = styled("div")(
  ({ theme: { palette, textGlows }, disabled }) => ({
    display: "flex",
    gap: 12,
    alignItems: "center",
    ...(!disabled && {
      "&:hover": {
        color: palette.blueLights[500],
        textShadow: textGlows[2],
        cursor: "pointer",
      },
    }),
  })
);

export const Time = styled("div")(() => ({
  fontFamily: "monospace",
  transform: "translateY(1px)",
}));

export const ActionIconButton = styled((props) => (
  <IconButton {...props} size="small" color="blueLights" />
))({
  transform: "scale(0.75)",
});

export const Actions = styled("div")(() => ({
  display: "flex",
}));
