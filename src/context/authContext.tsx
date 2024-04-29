import { createContext, useContext, useEffect, useState } from "react";
import { useLocalStorage } from "../Hooks/useLocalStorage";

interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthContextProps {
  token: string | null;
  handleSetToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { getItem, setItem } = useLocalStorage();
  const [token, setToken] = useState<string | null>(null);

  const handleSetToken = (data: string) => {
    setItem("token", data);
    setToken(data);
  };

  const getToken = async () => {
    const data = await getItem("token");
    setToken(data);

    return token;
  };

  useEffect(() => {
    getToken();
  }, []);

  return (
    <AuthContext.Provider value={{ token, handleSetToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  const authState = useContext(AuthContext);
  return authState;
};
