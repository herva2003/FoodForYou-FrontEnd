import { Navigate } from "react-router-dom";

interface AuthRedirectProps {
  isLogged: boolean;
}

const AuthRedirect: React.FC<AuthRedirectProps> = ({ isLogged }) => {
  return isLogged ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/signIn" replace />
  );
};

export default AuthRedirect;
