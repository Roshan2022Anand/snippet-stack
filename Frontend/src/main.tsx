import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ToastContainer } from "react-toastify";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "./pages/auth-pages/Signup.tsx";
import Login from "./pages/auth-pages/Login.tsx";
import Create from "./pages/user-pages/Create.tsx";
import Update from "./pages/user-pages/Update.tsx";
import ViewPost from "./pages/view-page/ViewPost.tsx";
import ViewProfile from "./pages/view-page/ViewProfile.tsx";
import Profile from "./pages/user-pages/Profile.tsx";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/signup", element: <Signup /> },
  { path: "/login", element: <Login /> },
  { path: "/create", element: <Create /> },
  { path: "/update/:id", element: <Update /> },
  { path: "/profile", element: <Profile /> },
  { path: "view/post/:postId", element: <ViewPost /> },
  { path: "view/profile/:userID", element: <ViewProfile /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      draggable
      pauseOnHover
      theme="light"
    />
    <RouterProvider router={router} />
  </StrictMode>
);
