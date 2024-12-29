import { Button, TextField, styled } from "@mui/material";

export const Layout = styled("div")(() => ({
  padding: 16,
  display: "grid",
  rowGap: 16,
}));

export const InputLayout = styled("div")(() => ({
  display: "grid",
  gap: 12,
}));

export const UrlInput = styled(TextField)(() => ({
  width: 400,
}));

export const DescInput = styled((props) => <TextField {...props} multiline />)({
  width: 400,
  gridColumn: "1 / -1",
});

export const AddButton = styled(Button)(() => ({
  width: "fit-content",
}));

export const FooterLayout = styled("div")(() => ({
  display: "grid",
  gridTemplateColumns: "1fr auto",
}));
