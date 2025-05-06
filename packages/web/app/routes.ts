import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("AppLayout.tsx", [
    //index("login/Login.tsx"), // FIXME: This should only navigate to login if no cookie is present otherwise it should go to /song
    route("login", "outlets/login/Login.tsx"),
    route("song", "outlets/song/Song.tsx", [
      index("outlets/song/outlets/recent-songs-view/RecentSongsView.tsx"),
      route(":songId", "outlets/song/outlets/song-view/SongView.tsx"),
    ]),
    // route("exercises", "outlets/exercises/Exercises.tsx", [
    //   index
    // ]),
  ]),
] satisfies RouteConfig;

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />,
//     children: [
//       {
//         index: true,
//         element: <Navigate replace to="/login" />,
//       },
//       {
//         path: "/login",
//         element: <Login />,
//       },
//       {
//         path: "/song",
//         element: <Songs />,
//         children: [
//           {
//             index: true,
//             element: <EmptySongView />,
//           },
//           {
//             path: ":songId",
//             element: <SongView />,
//           },
//         ],
//       },
//       {
//         path: "/exercise",
//         element: <Exercises />,
//         children: [
//           {
//             index: true,
//             element: <div>Start all</div>,
//           },
//           {
//             path: ":exerciseId",
//             element: <Exercise />,
//           },
//         ],
//       },
//       // {
//       //   path: "webaudio",
//       //   element: <WebAudioTest />,
//       // },
//     ],
//   },
// ]);
