import { styled } from "@mui/material";

export const AmpKnob = styled("div")(() => ({
  width: 85,
  height: 70,
  display: "grid",
  alignItems: "center",
  justifyContent: "center",
  justifyItems: "center",
  //   boxShadow: "0 -3px 1px 4px black",
  //   backgroundImage: "linear-gradient(#747474, #060a09 60%, #747474)",
  //   borderRadius: "50%",
}));

export const AmpNumbers = styled("div")(
  ({ theme: { palette, textGlows }, value, tick, on }) => {
    // If tick is true, the content is a "tick" mark (a dash char) and gets rotated to align with the angle from center.
    // If tick is false, the content is a number (ex 0, 2, 4, 6, 8, 10) and stays unrotated.

    const sweep = 270; // The degrees from 0 (minimum) to 10 (maximum)
    const offset = 225; // 0 is East. This value defines how many degrees counter-clockwise from 0 to make the knob's 0 (-225 degrees is 0, 45 degrees is 10)
    const degree = sweep * value - offset;
    const r = 36;

    // degrees to radians => degrees * (Pi/180)
    const x = r * Math.cos(degree * (Math.PI / 180)); // r * cos(radians);
    const y = r * Math.sin(degree * (Math.PI / 180)); // r * sin(radians);

    return {
      transition: "all 400ms",
      gridArea: "1 / 1",
      // +1 on the Y translation is just to position it a tiny bit nicer around the knob. It's an offset composed with the x/y degrees calc.
      transform: `translate(${x}px, ${y + 1}px) rotate(${
        tick ? degree : 0
      }deg)`,
      fontSize: 10,
      fontWeight: 600,
      color: palette.lightGrey[600],
      ...(on && {
        color: palette.blueLights[500],
        textShadow: `${textGlows[5]}, ${textGlows[3]}, ${textGlows[2]}`,
      }),
    };
  }
);

export const AmpKnobBarrel = styled("div")(({ theme: { palette } }) => ({
  gridArea: "1 / 1",
  position: "relative",
  backgroundImage: `linear-gradient(to bottom, ${palette.lightGrey[600]}, ${palette.darkGrey[800]} 70%)`,
  borderRadius: "50%",
  border: "2px solid black",
  width: 52,
  height: 52,
  boxShadow: "3px 5px 5px #000000DD",

  "&:after": {
    content: '""',
    position: "absolute",
    width: 49,
    height: 49,
    backgroundImage: `linear-gradient(to bottom, ${palette.darkGrey[900]}, ${palette.darkGrey[800]})`,
    borderRadius: "50%",
    transform: "translate(1.5px, 1.5px)",
  },
}));

export const AmpKnobMark = styled("div")(
  ({ value, theme: { palette, glows } }) => {
    const sweep = 270; // The degrees from 0 (minimum) to 1 (maximum)
    const offset = 225; // 0 is East. This value defines how many degrees counter-clockwise from 0 to make the knob's 0 (-225 degrees is 0, 45 degrees is 10)
    const degree = sweep * value - offset;
    const r = 16;

    // degrees to radians => degrees * (Pi/180)
    const x = r * Math.cos(degree * (Math.PI / 180)); // r * cos(radians);
    const y = r * Math.sin(degree * (Math.PI / 180)); // r * sin(radians);

    return {
      gridArea: "1 / 1",
      position: "relative",
      zIndex: 20,
      width: 3,
      height: 3,
      borderRadius: 3,
      backgroundColor: palette.blueLights[500],
      boxShadow: glows[2],
      transform: `translate(${x}px, ${y}px) rotate(${degree}deg)`,
      transition: "transform 400ms",
    };
  }
);
