import React from "react";
import { RouterProvider } from "react-router-dom";
import { AuthRoute, Route } from "./router";
import { useAuth } from "./context/authContext";

const App: React.FC = () => {
  const { token } = useAuth();

  return <RouterProvider router={token ? Route : AuthRoute} />;
};

export default App;
