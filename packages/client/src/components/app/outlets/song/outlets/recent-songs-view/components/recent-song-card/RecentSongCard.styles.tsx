import { CardActionArea, styled } from "@mui/material";

export const CardActionAreaLayout = styled(CardActionArea)(() => ({
  width: 340,
  padding: 8,
  display: "flex",
  justifyContent: "start",
  alignItems: "start",
  gap: 16,
  fontSize: 16,
  lineHeight: "24px",
}));

export const SongTitle = styled("div")(() => ({
  fontWeight: 700,
  display: "-webkit-box",
  "-webkit-line-clamp": "2" /* Maximum of 2 lines */,
  "-webkit-box-orient": "vertical",
  overflow: "hidden",
  textOverflow: "ellipsis",
  wordBreak: "break-word",
}));

export const Muted = styled("div")(({ theme: { palette } }) => ({
  fontSize: "0.8rem",
  color: palette.grey[500],
  lineHeight: "20px",
}));

export const Cover = styled("div")(() => ({
  width: 90,
  height: 90,
  minWidth: 90,
  borderRadius: 6,
  overflow: "hidden",
  background: "black",

  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
}));
