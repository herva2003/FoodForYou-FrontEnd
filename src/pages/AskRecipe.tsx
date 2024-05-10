import React from "react";
import Sidebar from "../components/Sidebar";
import Dropdown from "../components/Dropdown";

const AskRecipe: React.FC = () => {
  return (
    <div className="w-screen h-screen flex bg-dark-white">
      <Sidebar />
      <div className=" flex w-full h-full flex pl-[120px] pt-[100px] flex-col">
        <div className="w-[300px] h-[40px] mb-[100px]">
          <h1 className="text-2xl">Solicite sua receita</h1>
        </div>
        <Dropdown />
      </div>
    </div>
  );
};

export default AskRecipe;
