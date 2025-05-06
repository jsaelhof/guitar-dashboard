import { Outlet } from "react-router";
import { ThemeProvider } from "./components/theme-provider";

const AppLayout = () => (
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <div className="h-screen">
      <Outlet />
    </div>
  </ThemeProvider>
);

export default AppLayout;
