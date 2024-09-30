import { TextField, styled } from "@mui/material";

export const Layout = styled("div")(() => ({
  display: "grid",
  rowGap: 16,
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
  alignItems: "center",
}));

export const Controls = styled("div")(() => ({
  display: "grid",
  gridTemplateColumns: "1fr auto auto",
  gap: 16,
}));

export const GuitarTabInputLayout = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  gap: 8,
}));

export const GuitarButtonLayout = styled("div")(() => ({
  display: "flex",
  gap: 8,
  alignItems: "center",
}));
