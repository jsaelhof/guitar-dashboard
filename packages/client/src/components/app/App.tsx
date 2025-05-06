import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "./theme/theme";
import { Outlet } from "react-router-dom";
import ThemeSwitch from "./components/theme-switch/ThemeSwitch";

export const App = () => (
  <ThemeProvider theme={theme} noSsr>
    <CssBaseline />
    {/* <ThemeSwitch /> */}
    <Outlet />
  </ThemeProvider>
);
