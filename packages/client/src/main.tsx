import ReactDOM from "react-dom/client";
import Songs from "./components/app/outlets/songs/Songs";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import SongView from "./components/app/outlets/songs/outlets/song-view/SongView";
import WebAudioTest from "./WebAudioTest";
import { Login } from "./components/app/outlets/login/Login";
import { EmptySongView } from "./components/app/outlets/songs/outlets/empty-song-view/EmptySongView";
import { Exercises } from "./components/app/outlets/exercises/Exercises";
import { Exercise } from "./components/app/outlets/exercises/outlets/exercise/Exercise";
import { App } from "./components/app/App";

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
        element: <Songs />,
        children: [
          {
            index: true,
            element: <EmptySongView />,
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
