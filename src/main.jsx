import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./Components/Shared/Errorpage/Errorpage";
import Root from "./Components/Layout/Root";
import AuthProvider from "./Contexts/AuthContext/AuthProvider";
import Login from "./Components/Forms/LogIn";
import SignUp from "./Components/Forms/SignUp";
import Home from "./Components/Pages/Home/Home";
import AllArtifacts from "./Components/Pages/AllArtifacts/AllArtifacts";
import ArtifactDetails from "./Components/Pages/ArtifactDetails/ArtifactDetails";

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage></ErrorPage>,
    element: <Root></Root>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/all-artifacts",
        element: <AllArtifacts></AllArtifacts>,
      },
      {
        path: "/artifact-details/:id",
        element: <ArtifactDetails></ArtifactDetails>,
        loader: ({ params }) =>
          fetch(`http://localhost:3000/Artifacts/${params.id}`),
      },
      {
        path: "/login",
        element: <Login></Login>,
      },
      {
        path: "/signup",
        element: <SignUp></SignUp>,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
