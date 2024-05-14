import React from "react";
import Sidebar from "../components/Sidebar";
import SidebarPage from "../components/SidebarPage";

const MyRecipes: React.FC = () => {
  return (
    <SidebarPage headerTitle="Minhas Receitas">
      <div className="w-screen h-screen flex bg-dark-white">
        <div></div>
      </div>
    </SidebarPage>
  );
};

export default MyRecipes;
