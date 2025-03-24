import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import Layout from "../Layout";
import Play from "./Routes/Play";
import Compete from "./Routes/Compete";
import AboutUs from "./Routes/AboutUs";
import Register from "./Routes/Register";
import Login from "./Routes/Login";
import AuthContextProvider from "./context/AuthContext/AuthContextProvider";
import Profile from "./Routes/Profile";
import RoomLobby from "./Routes/RoomLobby";
import UsersContextProvider from "./context/UsersContext/UsersContextProvider";
import TestTimeContextProvider from "./context/TestTimeContext/TestTimeContextProvider";
import StartGameContextProvider from "./context/StartGame/StartGameContextProvider";
import UserStatsContextProvider from "./context/UserStatsContext/UserStatsContextProvider";
import GameOverContextProvider from "./context/GameOverContext/GameOverContextProvider";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Play />,
      },
      {
        path: "/compete",
        element: <Compete />,
      },
      {
        path: "/compete/room/:id",

        element: <RoomLobby />,
      },
      {
        path: "/about",
        element: <AboutUs />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GameOverContextProvider>
      <UserStatsContextProvider>
        <StartGameContextProvider>
          <UsersContextProvider>
            <TestTimeContextProvider>
              <AuthContextProvider>
                <RouterProvider router={router} />
              </AuthContextProvider>
            </TestTimeContextProvider>
          </UsersContextProvider>
        </StartGameContextProvider>
      </UserStatsContextProvider>
    </GameOverContextProvider>
  </StrictMode>
);
