import { ThemeProvider } from "@mui/material";
import { theme } from "./theme/theme";
import { Outlet } from "react-router-dom";

export const App = () => (
  <ThemeProvider theme={theme}>
    <Outlet />
  </ThemeProvider>
);
