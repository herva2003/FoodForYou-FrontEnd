import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Route, AuthRoute } from './router';
import { useAuth } from './context/authContext';
import api from './services/api';

const App: React.FC = () => {
  const { token } = useAuth();

  useEffect(() => {
    if (typeof window !== 'undefined' && token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token]);

  return <RouterProvider router={token ? Route : AuthRoute} />;
};

export default App;