import { Color, createTheme } from "@mui/material";

declare module "@mui/material/styles" {
  interface Palette {
    lightGrey: Partial<Color>;
    blueLights: Partial<Color>;
    darkGrey: Partial<Color>;
  }

  interface PaletteOptions {
    lightGrey: Partial<Color>;
    blueLights: Partial<Color>;
    darkGrey: Partial<
      Color & {
        820: string;
        840: string;
        860: string;
        880: string;
      }
    >;
    darkSecondary: Color;
  }

  interface Theme {
    glows: ["none", string, string, string];
    textGlows: ["none", string, string, string, string, string, string];
  }

  // allow configuration using `createTheme`
  interface ThemeOptions {
    glows?: ["none", string, string, string];
    textGlows?: ["none", string, string, string, string, string, string];
  }

  //   interface Theme {
  //     status: {
  //       danger: string;
  //     };
  //   }
  // allow configuration using `createTheme`
  //   interface ThemeOptions {
  //     status?: {
  //       danger?: string;
  //     };
  //   }
}

declare module "@mui/material/IconButton" {
  interface IconButtonPropsColorOverrides {
    blueLights: true;
  }
  interface ButtonPropsColorOverrides {
    blueLights: true;
  }
}

export const theme = createTheme({
  glows: ["none", "0 0 6px 0.5px #79c4e7", "0 0 6px 1px #79c4e7"],
  textGlows: [
    "none",
    "0 0 1px #79c4e7",
    "0 0 2px #79c4e7",
    "0 0 3px #79c4e7",
    "0 0 4px #79c4e7",
    "0 0 5px #79c4e7",
    "0 0 6px #79c4e7",
  ],
  palette: {
    secondary: {
      main: "#424242",
    },
    blueLights: {
      300: "#97e0ff",
      400: "#84d9fd",
      500: "#79c4e7",
      800: "#30657c",
      900: "#1f4353",
      main: "#79c4e7",
    },
    lightGrey: {
      200: "#a9a9a8",
      300: "#969696",
      400: "#858585",
      500: "#767676",
      600: "#636363",
      900: "#3f3f3f",
    },
    darkGrey: {
      500: "#181818",
      600: "#171717",
      700: "#161616",
      800: "#151515",
      820: "#141414",
      840: "#131313",
      860: "#121212",
      880: "#111111",
      900: "#0d0d0d",
    },
    darkSecondary: {
      main: "#ddd",
    },
  },

  components: {
    MuiIconButton: {
      styleOverrides: {
        root: ({ ownerState, theme: { palette, textGlows } }) => {
          switch (ownerState.color) {
            case "blueLights":
              return {
                "&.Mui-disabled": {
                  color: palette.blueLights[900],
                },
                "> svg": {
                  filter: `drop-shadow(${textGlows[0]})`,

                  "&:hover": {
                    filter: `drop-shadow(${textGlows[6]})`,
                  },
                },
              };
            default:
              return;
          }
        },
      },
    },

    MuiButton: {
      variants: [
        {
          props: { size: "xsmall" },
          style: { fontSize: 10, padding: "4px 6px", minWidth: 50 },
        },
      ],
      styleOverrides: {
        root: ({ ownerState, theme: { palette, textGlows } }) => {
          switch (ownerState.color) {
            case "darkSecondary":
              return {
                "&.Mui-disabled": {
                  color: "#444",
                  borderColor: "#242424",
                },
                ":hover": {
                  color: palette.blueLights[300],
                  textShadow: textGlows[1],
                  borderColor: palette.blueLights[800],
                },
              };
            default:
              return;
          }
        },
      },
    },
  },
});
