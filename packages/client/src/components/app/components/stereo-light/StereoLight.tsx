import { styled } from "@mui/material";

export const StereoLight = styled("div")(
  ({
    theme: { palette, glows },
    $on,
    $size,
  }: {
    $on: boolean;
    $size?: "small" | "large";
  }) => ({
    position: "relative",
    width: 4,
    height: 4,
    borderRadius: "50%",
    backgroundColor: palette.lightGrey[900],
    border: "1px solid black",
    transition: "transform 400ms",

    ...($size === "large" && {
      width: 8,
      height: 8,
    }),

    ...($on && {
      backgroundColor: palette.blueLights[500],
      boxShadow: glows[2],
      border: "none",
    }),

    // Highlight dot on the light bulb
    "&:after": {
      content: '""',
      position: "absolute",
      width: 2,
      height: 1,
      borderRadius: "50%",
      background: "linear-gradient(to bottom, white, transparent)",
      opacity: 0.75,
      transform: "rotate(-45deg)",
      top: "20%",
      left: "10%",

      ...($size === "large" && {
        width: 4,
        height: 2,
      }),
    },
  })
);
