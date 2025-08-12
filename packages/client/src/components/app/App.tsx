import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "./theme/theme";
import { Outlet } from "react-router-dom";
import ThemeSwitch from "./components/theme-switch/ThemeSwitch";
import { useEffect, useState } from "react";
import { post } from "./utils/post";

export const App = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const mountSongDrive = async () => {
      const response = await post("/util/mount");
      const { error } = (await response.json()) as { error: boolean };
      if (!error) setMounted(true);
      console.error({ error });
    };

    mountSongDrive();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <ThemeProvider theme={theme} noSsr>
      <CssBaseline />
      {/* <ThemeSwitch /> */}
      {mounted ? <Outlet /> : null}
    </ThemeProvider>
  );
};
