import { Color, createTheme, PaletteColorOptions } from "@mui/material";

declare module "@mui/material/styles" {
  interface Palette {
    lightGrey: Partial<Color>;
    blueLights: Partial<Color>;
    darkGrey: Partial<Color>;
  }

  interface PaletteOptions {
    lightGrey: PaletteColorOptions;
    blueLights: PaletteColorOptions;
    darkGrey: PaletteColorOptions & {
      820: string;
      840: string;
      860: string;
      880: string;
    };
    darkSecondary: PaletteColorOptions;
    stereo: PaletteColorOptions;
  }

  interface Theme {
    glows: ["none", string, string];
    textGlows: ["none", string, string, string, string, string, string];
  }

  // allow configuration using `createTheme`
  interface ThemeOptions {
    glows?: ["none", string, string];
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
  interface IconButtonPropsColorOverrides {
    blueLights: true;
  }
  interface IconButtonPropsSizeOverrides {
    xsmall: true;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsSizeOverrides {
    xsmall: true;
  }

  interface ButtonPropsVariantOverrides {
    stereo: true;
  }

  interface ButtonPropsColorOverrides {
    darkSecondary: true;
    blueLights: true;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    underline: true;
    system: true;
  }
}

export const theme = createTheme({
  // NOTE: Could not get color overriding to work properly using these. I added them to try and wire up a manual light/dark switch.
  // colorSchemes: {
  //   dark: true,
  // },
  // cssVariables: {
  //   colorSchemeSelector: "class",
  // },
  typography: {
    fontFamily: "Circular, Roboto, sans-serif",
  },
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
    mode: "dark", // This overrides any other setting of the color mode and just permanently makes the theme use dark mode.
    primary: {
      main: "#FAFAFA",
    },
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
      300: "#242424",
      400: "#202020",
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
    stereo: {
      main: "#0d0d0d",
    },
  },

  components: {
    MuiTypography: {
      variants: [
        {
          props: { variant: "underline" },
          style: {
            fontSize: 10,
            textTransform: "uppercase",
            color: "GrayText",
            lineHeight: "10px",
          },
        },
        {
          props: { variant: "system" },
          style: {
            fontFamily: "system-ui",
          },
        },
        {
          props: { variant: "stereo" },
          style: ({ theme: { palette } }) => ({
            color: palette.lightGrey[200],
            fontFamily: "StereoGothic",
            fontWeight: 400,
            textTransform: "uppercase",
            fontSize: 8,
          }),
        },
      ],
    },

    MuiIconButton: {
      variants: [
        {
          props: { size: "xsmall" },
          style: { padding: 4, "& .MuiSvgIcon-root": { fontSize: 14 } },
        },
        {
          props: { color: "blueLights" },
          style: ({ theme: { palette, textGlows } }) => ({
            "&.Mui-disabled": {
              color: palette.blueLights[900],
            },
            "> svg": {
              filter: `drop-shadow(${textGlows[0]})`,
            },
            ":hover": {
              backgroundColor: "transparent",

              "> svg": {
                filter: `drop-shadow(${textGlows[6]})`,
              },
            },
          }),
        },
      ],
    },

    MuiButton: {
      variants: [
        {
          props: { size: "xsmall" },
          style: { fontSize: 10, padding: "4px 6px", minWidth: 50 },
        },
        {
          props: { variant: "stereo" },
          style: ({ theme: { palette } }) => ({
            padding: "4px 16px",
            border: "1px solid black",
            borderRadius: 6,
            background: `linear-gradient(${palette.darkGrey[500]} 0%, ${palette.darkGrey[880]} 100%)`,

            fontFamily: "StereoGothic",
            textTransform: "uppercase",
            color: palette.lightGrey[200],
            fontSize: 8,

            ":hover": {
              color: palette.blueLights[500],
            },

            "&.MuiButton-sizeSmall": {
              fontSize: 7,
              transform: "translateY(1px)",
            },
          }),
        },
        {
          props: { color: "blueLights" },
          style: ({ theme: { palette, textGlows } }) => ({
            color: palette.blueLights[300],
            backgroundColor: palette.darkGrey[900],
            ":hover": {
              textShadow: textGlows[2],
              backgroundColor: palette.darkGrey[300],
            },
            "&.Mui-disabled": {
              backgroundColor: palette.darkGrey[900],
              color: palette.lightGrey[600],
            },
          }),
        },
        {
          props: { color: "darkSecondary" },
          style: ({ theme: { palette, textGlows } }) => ({
            "&.Mui-disabled": {
              color: "#444",
              borderColor: "#242424",
            },
            ":hover": {
              color: palette.blueLights[300],
              textShadow: textGlows[1],
              borderColor: palette.blueLights[800],
            },
          }),
        },
      ],
    },

    MuiListItemIcon: {
      styleOverrides: {
        // Name of the slot
        root: ({ theme: { palette } }) => ({
          color: palette.primary.main,
          minWidth: 32,
        }),
      },
    },
  },
});
