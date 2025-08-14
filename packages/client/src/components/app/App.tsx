import {
  Box,
  CircularProgress,
  CssBaseline,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { theme } from "./theme/theme";
import { Outlet } from "react-router-dom";
// import ThemeSwitch from "./components/theme-switch/ThemeSwitch";
import { useEffect, useState } from "react";
import { post } from "./utils/post";

export const App = () => {
  const [library, setLibrary] = useState<"mounting" | "mounted" | "error">(
    "mounting"
  );

  useEffect(() => {
    const mountSongDrive = async () => {
      const response = await post("/util/mount");
      const { error } = await response.json();
      setLibrary(error ? "error" : "mounted");
    };

    mountSongDrive();
  }, []);

  return (
    <ThemeProvider theme={theme} noSsr>
      <CssBaseline />
      {/* <ThemeSwitch /> */}

      {library === "mounted" ? (
        <Outlet />
      ) : (
        <Box display="flex" justifyContent="center" paddingTop={10}>
          {library === "mounting" && <CircularProgress />}

          {library === "error" && (
            <Typography variant="body1">
              Error mounting music library
            </Typography>
          )}
        </Box>
      )}
    </ThemeProvider>
  );
};
