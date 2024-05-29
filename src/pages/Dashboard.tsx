import React from "react";
import SidebarPage from "../components/SidebarPage";
import { Button } from "@mui/material";

const Dashboard: React.FC = () => {
  return (
    <SidebarPage headerTitle="Home">
      <div className="flex flex-col items-center justify-center p-6 m-6 gap-2">
        <img className="w-[280px] h-[250px]" src="src/assets/Logo.png" alt="Logo" />
        <p className="font-bold text-3xl text-black text-center">
          Cada receita em nosso site é  
          <span className="block"></span> cuidadosamente selecionada 
          <span className="block"></span> para despertar os sentidos e 
          satisfazer os paladares mais 
          <span className="block"></span> exigentes.
        </p>
        <div className="flex flex-row gap-4 p-8">
          <button className="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
            Comece agora
          </button>
          <button className="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
            Ver receitas
          </button>
        </div>
      </div>
    </SidebarPage>
  );
};

export default Dashboard;
