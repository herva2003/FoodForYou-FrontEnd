import { createBrowserRouter } from "react-router-dom";
import SignUp from "./src/pages/SignUp";
import SignIn from "./src/pages/SignIn";
import AuthRedirect from "./src/components/AuthRedirect";
import Dashboard from "./src/pages/Dashboard";

export const AuthRoute = createBrowserRouter([
  {
    path: "/signIn",
    element: <SignIn />,
  },
  {
    path: "/signUp",
    element: <SignUp />,
  },
  {
    path: "/*",
    element: <AuthRedirect isLogged={false} />,
  },
]);

export const Route = createBrowserRouter([
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/*",
    element: <AuthRedirect isLogged={true} />,
  },
]);
