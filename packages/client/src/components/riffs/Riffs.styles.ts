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
