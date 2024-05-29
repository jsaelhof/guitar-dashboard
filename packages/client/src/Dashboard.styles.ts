import { styled } from "@mui/material";

export const DashboardLayout = styled("div")(() => ({
  display: "grid",
  overflow: "hidden",
  height: "100vh",
  gridTemplateColumns: "300px 1fr",
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
}));
