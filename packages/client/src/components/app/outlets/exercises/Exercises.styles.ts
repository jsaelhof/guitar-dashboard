import { styled } from "@mui/material";

// THIS WHOLE FILE IS A DUPLICATE OF DASHBOARD. I COULD PROBABLY EXTRACT A COMMON LAYOUT.
export const Layout = styled("div")(() => ({
  display: "grid",
  overflow: "hidden",
  height: "100vh",
  gridTemplateColumns: "250px 1fr",
  gridTemplateRows: "min-content 1fr",
  gridTemplateAreas: `
    'left header'
    'left content'
    `,
}));

export const LeftColumn = styled("div")(() => ({
  gridArea: "left",
  height: "100vh",
  overflowY: "scroll",
  borderRight: "1px solid rgba(0,0,0,0.05)",
}));
