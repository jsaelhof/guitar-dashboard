import ReactDOM from "react-dom/client";
import Dashboard from "./Dashboard";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { AppProvider } from "./context/AppContext";
import App from "./App";

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
  {
    path: "test",
    element: <App />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <RouterProvider router={router} />
);
