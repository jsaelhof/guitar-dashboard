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

export const AmpNumbers = styled("div")(({ value, tick }) => {
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
    gridArea: "1 / 1",
    transform: `translate(${x}px, ${y}px) rotate(${tick ? degree : 0}deg)`,
    fontSize: 10,
    fontWeight: 600,
  };
});

export const AmpKnobBarrel = styled("div")(() => ({
  gridArea: "1 / 1",
  //boxShadow: "0 -3px 1px 4px black",
  position: "relative",
  backgroundImage: "linear-gradient(#747474, #060a09 60%, #747474)",
  borderRadius: "50%",
  width: 52,
  height: 52,

  "&:after": {
    content: '""',
    position: "absolute",
    width: 55,
    height: 55,
    backgroundImage: "linear-gradient(to right, black, darkgray, black)",
    borderRadius: "50%",
    transform: "translate(-1.5px, -3px)",
  },
  //   borderRadius: "50%",
  //   background: "linear-gradient(from top, black, darkgray, black)",
  //   transform: "translateY(-5px)",
}));

export const AmpKnobSurface = styled("div")(() => ({
  gridArea: "1 / 1",
  position: "relative",
  width: 40,
  height: 40,
  zIndex: 10,

  // Knob surface border gradient
  "&:before": {
    content: '""',
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 0,
    margin: -4,
    borderRadius: "50%",
    background: "linear-gradient(#f6ddb1, #745534, #b99a70, #f6ddb1, #b99a70)",
    border: "2px solid #141414",
  },

  // Knob surface gradient
  "&:after": {
    content: '""',
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1,
    borderRadius: "50%",
    backgroundImage:
      "repeating-conic-gradient(#b99a70 0%, #f6ddb1 15%, #b99a70 25%, #b19269 29%, #b99a70 33%)",
    border: "1px solid #00000022",
  },
}));

export const AmpKnobMark = styled("div")(({ value }) => {
  const sweep = 270; // The degrees from 0 (minimum) to 1 (maximum)
  const offset = 225; // 0 is East. This value defines how many degrees counter-clockwise from 0 to make the knob's 0 (-225 degrees is 0, 45 degrees is 10)
  const degree = sweep * value - offset;
  const r = 14;

  // degrees to radians => degrees * (Pi/180)
  const x = r * Math.cos(degree * (Math.PI / 180)); // r * cos(radians);
  const y = r * Math.sin(degree * (Math.PI / 180)); // r * sin(radians);

  return {
    gridArea: "1 / 1",
    position: "relative",
    zIndex: 20,
    width: 8,
    height: 1.5,
    borderRadius: 2,
    backgroundColor: "#242424",
    transform: `translate(${x}px, ${y}px) rotate(${degree}deg)`,
    transition: "transform 300ms",
  };
});
