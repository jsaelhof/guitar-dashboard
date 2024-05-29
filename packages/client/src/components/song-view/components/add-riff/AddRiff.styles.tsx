import { Paper, TextField, styled } from "@mui/material";

export const Layout = styled(Paper)(() => ({
  marginTop: 24,
  display: "grid",
  rowGap: 16,
  padding: 16,
}));

export const Info = styled(TextField)(() => ({
  width: 400,
}));

export const RiffList = styled("div")(() => ({
  display: "grid",
  rowGap: 8,
}));

export const RiffInput = styled("div")(() => ({
  display: "flex",
  gap: 8,
}));

export const Controls = styled("div")(() => ({
  display: "flex",
  gap: 16,
}));
