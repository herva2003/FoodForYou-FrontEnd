import { createBrowserRouter } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import AuthRedirect from "./components/AuthRedirect";
import Dashboard from "./pages/Dashboard";
import MyRecipes from "./pages/MyRecipes";
import Ingredients from "./pages/Ingredients";

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
    path: "/ingredients",
    element: <Ingredients />,
  },
  {
    path: "/myRecipes",
    element: <MyRecipes />,
  },
  {
    path: "/*",
    element: <AuthRedirect isLogged={true} />,
  },
]);
