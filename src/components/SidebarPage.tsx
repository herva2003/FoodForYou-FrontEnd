import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useAuth } from "../context/authContext";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";

interface SidebarPage {
  children: React.ReactNode
  headerTitle: string
}

const SidebarPage: React.FC<SidebarPage> = ({ children, headerTitle }) => {
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();
  const {  handleSetToken, getRefreshToken, getToken } = useAuth();

  const logout = async () => {
    try {
      const accessToken = await getToken(); 
      const refreshToken = await getRefreshToken(); 
  
      const response = await api.post("/api/v1/auth/logout", {
        accessToken,
        refreshToken
      });
  
      if (response.status === 200) {
        handleSetToken("", "");
        localStorage.removeItem("refreshToken");
        navigate("/login");
      } else {
        alert("Erro ao fazer logout");
      }
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      alert("Erro ao fazer logout. Por favor, tente novamente mais tarde.");
    }
  };


  return (
    <>
      <div className="flex flex-col w-full h-full min-h-[100vh]">
        <div className="flex w-full h-[70px] border-b border-border bg-dark-white">
          <Sidebar visible={visible} setVisible={setVisible} />
          <Header visible={visible} headerTitle={headerTitle} />
        </div>

        <div
          className={`${
            visible ? "pl-[340px]" : "pl-[90px]"
          } w-full h-full bg-dark-white `}>
          {children}
        </div>
      </div>
      <button className="absolute top-2 right-2 bg-red-500 px-4 py-2 rounded-lg text-white" onClick={logout}>
        Sair
      </button>
    </>
  );
};

export default SidebarPage;
