import ReactDOM from "react-dom/client";
import Dashboard from "./Dashboard";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import SongView from "./components/song-view/SongView";

const router = createBrowserRouter([
  // {
  //   path: "/",
  //   element: <div>REDIRECT?</div>,
  // },
  // {
  //   path: ":songId",
  //   element: (
  //     <AppProvider>
  //       <Dashboard />
  //     </AppProvider>
  //   ),
  // },
  {
    path: "/",
    element: <Dashboard />,
    children: [
      {
        path: ":songId",
        element: <SongView />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <RouterProvider router={router} />
);
