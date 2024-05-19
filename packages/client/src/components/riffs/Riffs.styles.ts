import { styled } from "@mui/material";

export const RiffList = styled("ul")(() => ({
  display: "flex",
  gap: 32,
  justifyContent: "center",
}));

export const RiffListItem = styled("li")(({ theme: { palette } }) => ({
  listStyle: "none",
  fontSize: 12,
  cursor: "pointer",

  "&:hover": {
    color: palette.primary.main,
  },
}));

export const SectionSummary = styled("div")(() => ({
  width: "100%",
  display: "grid",
  gridTemplateColumns: "auto 1fr auto",
  alignItems: "center",
  gap: 16,
}));

export const UriTablature = styled("img")(() => ({ width: 750 }));

export const OrderLayout = styled("div")(() => ({
  display: "grid",
  gridTemplateColumns: "24px",
  gridTemplateRows: "12px 12px",
  lineHeight: "12px",
}));

export const RiffOrderDown = styled("div")(({ theme: { palette } }) => ({
  "&:hover > svg": {
    fill: palette.primary.main,
  },
}));

export const RiffOrderUp = styled(RiffOrderDown)(() => ({
  transform: "rotate(180deg)",
}));
