import React from "react";
import Sidebar from "../components/Sidebar";
import Dropdown from "../components/Dropdown";
import CustomButton from "../components/CustomButton";
import FlatList from "flatlist-react";
import { useIngredients } from "../context/ingredientsContext";
import IngredientCard from "../components/IngredientCard";

const Ingredients: React.FC = () => {
  const {ingredients} = useIngredients();

  return (
    <div className="w-screen h-screen flex bg-dark-white">
      <Sidebar />
      <div className="flex flex-row w-full justify-center">
      <div className=" flex h-full pl-[50px] pt-[50px] flex-col ">
        <div className="w-[400px] h-[40px] mb-[20px]">
          <h1 className="text-2xl">Sua lista de ingredientes</h1>
        </div>
          <h1 className="text-sm mb-10 w-[600px] text-description">Selecione os ingredientes que você possui em sua casa. Eles ficarão salvos em sua conta e você pode altera-los a qualquer momento</h1>
        <Dropdown />
      </div>
        <div className="flex flex-col w-full max-w-lg h-[600px] bg-white mr-[50px] mt-[100px] rounded-lg p-[20px] relative ml-[40px]">
          <h1 className="text-lg mb-10">Ingredientes adicionados</h1>
          <div className="flex flex-col h-[430px] overflow-hidden overflow-y-scroll no-scrollbar">
            <FlatList  list={ingredients} renderOnScroll renderItem={(item, index) => (
              <div className="mb-5">
                <IngredientCard key={index} value={item.value}/>
              </div>
            )}/>
          </div>
          <div className="absolute bottom-5 right-0 left-0 w-full h-[44px] justify-center flex">
            <CustomButton title="Salvar" width="w-[90%]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ingredients;
