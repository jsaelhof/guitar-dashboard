import { styled } from "@mui/material";

export const AmpKnob = styled("div")(() => ({
  width: 16,
  height: 16,
  display: "grid",
  alignItems: "center",
  justifyContent: "center",
  justifyItems: "center",
}));

export const AmpKnobBarrel = styled("div")(
  ({ theme: { palette, glows }, $on }: { $on: boolean }) => ({
    gridArea: "1 / 1",
    position: "relative",
    backgroundImage: `linear-gradient(to bottom, ${palette.lightGrey[600]}, ${palette.darkGrey[800]} 70%)`,
    borderRadius: "50%",
    border: "2px solid black",
    width: 16,
    height: 16,
    boxShadow: "2px 3px 5px #000000DD",

    "&:after": {
      content: '""',
      position: "absolute",
      width: 14,
      height: 14,
      backgroundImage: `linear-gradient(to bottom, ${palette.darkGrey[900]}, ${palette.darkGrey[800]})`,
      borderRadius: "50%",
      transform: "translate(1px, 1px)",
      transition: "all 200ms",

      ...($on && {
        boxShadow: glows[2],
        backgroundImage: `radial-gradient(${palette.blueLights[300]}, ${palette.blueLights[500]}, ${palette.blueLights[900]})`,
      }),
    },
  })
);
