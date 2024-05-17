import ReactDOM from "react-dom/client";
import Dashboard from "./Dashboard";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import "./index.css";
import { AppProvider } from "./context/AppContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>REDIRECT?</div>,
  },
  {
    path: ":songId",
    element: (
      <AppProvider>
        <Dashboard />
      </AppProvider>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <RouterProvider router={router} />
);
