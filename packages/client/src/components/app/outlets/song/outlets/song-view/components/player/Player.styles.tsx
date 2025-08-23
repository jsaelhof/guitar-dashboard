import {
  ArrowDropDown,
  ArrowDropUp,
  ArrowLeft,
  ArrowRight,
} from "@mui/icons-material";
import { IconButton, styled } from "@mui/material";

export const PlayerBase = styled("div")(
  ({ $hasCover, theme: { palette } }) => ({
    height: 164,
    fontSize: 14,
    color: palette.lightGrey[200],
    display: "grid",
    gridTemplateColumns: `${
      $hasCover ? "auto " : ""
    }max-content max-content 1fr 90px 110px max-content max-content max-content max-content`,
    // Cover? Play Seek Playback Time Loop Pitch Speed Volume Sync
    alignItems: "center",
    justifyItems: "center",
    columnGap: 32,
    rowGap: 8,
    background: `linear-gradient(${palette.darkGrey[500]} 0%, ${palette.darkGrey[880]} 100%)`,
    padding: "20px 20px",
    borderRadius: 8,
    border: "2px solid #141414",
    boxShadow: "inset 0 5px 15px #00000099",
  })
);

export const AmpLabel = styled("div")(
  ({ theme: { palette }, small }: { small?: boolean }) => ({
    fontFamily: "StereoGothic",
    fontWeight: 400,
    textTransform: "uppercase",
    color: palette.lightGrey[200],
    justifySelf: "center",
    fontSize: 8,
    display: "flex",
    alignItems: "center",

    ...(small && {
      fontSize: 7,
      transform: "translateY(1px)",
    }),
  })
);

export const AmpDisplay = styled("div")(
  ({ theme: { palette }, $on }: { $on: boolean }) => ({
    fontFamily: "Circular",
    fontSize: 12,
    minWidth: 50,
    height: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    borderRadius: 6,
    border: "2px solid #141414",
    textShadow: "0 2px 3px #00000066",
    color: $on ? palette.blueLights[500] : "#FFFFFF22",
    backgroundColor: "#242424",
    boxShadow: $on ? `${palette.blueLights[800]} 0px 0px 10px inset` : "unset",
  })
);

export const DigitalButton = styled((props) => (
  <IconButton {...props} color="blueLights" />
))({});

export const LeftButton = styled(ArrowLeft)(
  ({ theme: { palette, textGlows } }) => ({
    cursor: "pointer",

    "&:hover": {
      color: palette.blueLights[500],
      filter: `drop-shadow(${textGlows[1]}) drop-shadow(${textGlows[3]})`,
    },
  })
);

export const RightButton = styled(ArrowRight)(
  ({ theme: { palette, textGlows } }) => ({
    cursor: "pointer",

    "&:hover": {
      color: palette.blueLights[500],
      filter: `drop-shadow(${textGlows[1]}) drop-shadow(${textGlows[3]})`,
    },
  })
);

export const UpButton = styled(ArrowDropUp)(
  ({ theme: { palette, textGlows } }) => ({
    cursor: "pointer",

    "&:hover": {
      color: palette.blueLights[500],
      filter: `drop-shadow(${textGlows[1]}) drop-shadow(${textGlows[3]})`,
    },
  })
);

export const DownButton = styled(ArrowDropDown)(
  ({ theme: { palette, textGlows } }) => ({
    cursor: "pointer",

    "&:hover": {
      color: palette.blueLights[500],
      filter: `drop-shadow(${textGlows[1]}) drop-shadow(${textGlows[3]})`,
    },
  })
);

export const TimeDisplay = styled("div")(({ theme: { palette } }) => ({
  fontFamily: "Circular",
  color: palette.blueLights[500],
}));

export const AlbumCover = styled("div")(({ $cover }) => ({
  gridRow: "span 2",
  width: 120,
  height: 120,
  backgroundImage: `url(${$cover})`,
  backgroundRepeat: "no-repeat",
  backgroundSize: "contain",
  backgroundPosition: "center center",
  borderRadius: 6,
  overflow: "hidden",
}));

export const PitchLayout = styled("div")(() => ({
  display: "grid",
  justifyItems: "center",
}));
