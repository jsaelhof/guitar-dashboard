import ReactDOM from "react-dom/client";
import Song from "./components/app/outlets/song/Song";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import SongView from "./components/app/outlets/song/outlets/song-view/SongView";
import WebAudioTest from "./WebAudioTest";
import { Login } from "./components/app/outlets/login/Login";
import { Exercises } from "./components/app/outlets/exercises/Exercises";
import { Exercise } from "./components/app/outlets/exercises/outlets/exercise/Exercise";
import { App } from "./components/app/App";
import RecentSongsView from "./components/app/outlets/song/outlets/recent-songs-view/RecentSongsView";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate replace to="/login" />, // FIXME: This should only navigate to login if no cookie is present otherwise it should go to /song
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/song",
        element: <Song />,
        children: [
          {
            index: true,
            element: <RecentSongsView />,
          },
          {
            path: ":songId",
            element: <SongView />,
          },
        ],
      },
      {
        path: "/exercise",
        element: <Exercises />,
        children: [
          {
            index: true,
            element: <div>Start all</div>,
          },
          {
            path: ":exerciseId",
            element: <Exercise />,
          },
        ],
      },
      // {
      //   path: "webaudio",
      //   element: <WebAudioTest />,
      // },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <RouterProvider router={router} />
);
