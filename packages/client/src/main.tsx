import ReactDOM from "react-dom/client";
import Dashboard from "./Dashboard";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import SongView from "./components/song-view/SongView";
import WebAudioTest from "./WebAudioTest";
import { Login } from "./components/login/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate replace to="/login" />,
  },
  // {
  //   path: ":songId",
  //   element: (
  //     <AppProvider>
  //       <Dashboard />
  //     </AppProvider>
  //   ),
  // },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/song",
    element: <Dashboard />,
    children: [
      {
        index: true,
        element: <div>INDEX</div>,
      },
      {
        path: ":songId",
        element: <SongView />,
      },
    ],
  },
  {
    path: "webaudio",
    element: <WebAudioTest />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <RouterProvider router={router} />
);
