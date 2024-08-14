import { createBrowserRouter } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import AuthRedirect from "./components/AuthRedirect";
import Dashboard from "./pages/Dashboard";
import MyRecipes from "./pages/MyRecipes";
import Ingredients from "./pages/Ingredients";
import RecipeIa from "./pages/RecipeIa";
import IdentifyIA from "./pages/IdentifyIA"
import HomePage from "./pages/HomePage";
import Community from "./pages/Community";

export const AuthRoute = createBrowserRouter([
  {
    path: "/signIn",
    element: <SignIn />,
  },
  {
    path: "/home",
    element: <HomePage />,
  },
  {
    path: "/signUp",
    element: <SignUp />,
  },
  {
    path: "/community",
    element: <Community />,
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
    path: "/recipeIA",
    element: <RecipeIa />,
  },
  {
    path: "/IdentifyIA",
    element: <IdentifyIA />,
  },
  {
    path: "/community",
    element: <Community />,
  },
  {
    path: "/*",
    element: <AuthRedirect isLogged={true} />,
  },
]);
