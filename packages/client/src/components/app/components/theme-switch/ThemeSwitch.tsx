import { useColorScheme } from "@mui/material";
import { useEffect } from "react";

const ThemeSwitch = () => {
  const { setMode } = useColorScheme();

  // This forces the mode to default to "dark".
  // I couldn't find a way to do this from the the theme config. None of the MUI docs suggestions seemed to worked to default the theme to dark but still allow user-controlled toggling.
  useEffect(() => setMode("dark"), []);

  // TODO: Implement a switch for user control.
  // Use setMode("light") to toggle to light mode.
  return null;
};

export default ThemeSwitch;
