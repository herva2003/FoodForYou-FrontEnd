import React, { useState, useEffect } from "react";
import SidebarPage from "../components/SidebarPage";
import RecipeCard from "../components/RecipeCard";
import api from "../services/api";
import Button from "../components/Button";
import Input from "../components/Input";
import { useAuth } from "../context/authContext";
import { Modal } from "@mui/material";
import { AiOutlineClockCircle, AiOutlineClose, AiOutlineCloseCircle, AiOutlinePlus } from "react-icons/ai";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import { RecipeProps } from "../interfaces/RecipeProps";
import Swal from "sweetalert2"

interface GeneratedRecipe {
  name: string;
  ingredients: string[];
  preparationMethod: string[];
  preparationTime: number;
}

const MyRecipes: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [visible, setVisible] = useState(false);
  const [recipes, setRecipes] = useState<RecipeProps[]>([]);
  const [newRecipeName, setNewRecipeName] = useState("");
  const [newIngredient, setNewIngredient] = useState("");
  const [ingredientsList, setIngredientsList] = useState<string[]>([]);
  const [newPreparationStep, setNewPreparationStep] = useState("");
  const [preparationMethodList, setPreparationMethodList] = useState<string[]>([]);
  const [newPreparationTime, setNewPreparationTime] = useState(0);
  const { getToken } = useAuth();

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const token = await getToken();
      const response = await api.get("/api/v1/user/recipe", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(response);
      if (response.data) {
        setRecipes(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };


  const submitAddedRecipe = async () => {
    try {
      Swal.fire({
        title: "Loading",
        html: "Loading",
        timer: 2000,
        timerProgressBar: true,
      });
  
      const token = await getToken();
      const formData = getFormData();
  
      const response = await api.post("/api/v1/user/recipe", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      Swal.close(); // Fechando o pop-up de carregamento
  
      console.log(response);
  
      if (response.data) {
        fetchRecipes();
        setOpenModal(false);
        Swal.fire({
          title: "Success!",
          text: "Recipe added successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error sending data:", error);
      Swal.close();
      Swal.fire({
        title: "Error!",
        text: "An error occurred while adding the recipe.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  

  const closeModal = () => {
    setOpenModal(false);
  };

  const addIngredientToList = () => {
    setIngredientsList([...ingredientsList, newIngredient]);
    setNewIngredient("");
  };

  const addPreparationStepToList = () => {
    setPreparationMethodList([...preparationMethodList, newPreparationStep]);
    setNewPreparationStep("");
  };

  const resetRecipeItemsInputs = () => {
    setIngredientsList([]);
    setPreparationMethodList([]);
    setNewPreparationStep("");
    setNewIngredient("");
  }
  
  const getFormData = (): {} => {
    return {
      name: newRecipeName,
      ingredients: ingredientsList,
      preparationMethod: preparationMethodList,
      preparationTime: newPreparationTime,
    };
  };

  return (
    <>
      <Modal
        style={{
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "center",
          justifySelf: "center",
        }}
        open={openModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="min-w-[50vw] min-h-[50vh] bg-white rounded-[4px] py-[20px] px-[40px]">
          <div className="flex justify-between items-center mb-[40px]">
            <h1 className="text-md text-title font-bold ">
              Adicionar nova receita
            </h1>
            <AiOutlineClose
              size={25}
              className="cursor-pointer text-title"
              onClick={closeModal}
            />
          </div>
          <form onSubmit={submitAddedRecipe}>
            <div className="mb-4">
              <label className="block text-title text-md font-semibold mb-2">
                Nome da Receita
              </label>
              <input
                type="text"
                value={newRecipeName}
                onChange={(e) => setNewRecipeName(e.target.value)}
                className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Nome da Receita"
              />
            </div>
            <h2 className="text-md text-title font-semibold mb-2">
              Ingredientes
            </h2>
            <div className="mb-4 flex">
              <input
                type="text"
                value={newIngredient}
                onKeyDown={(e) => {
                  if (e.key == "Enter") {
                    e.preventDefault()
                    addIngredientToList()
                  }
                }}
                onChange={(e) => setNewIngredient(e.target.value)}
                className="shadow appearance-none border rounded w-4/5 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Novo Ingrediente"
              />
              <Button
                type="button"
                title="Adicionar"
                width="w-1/5"
                onClick={addIngredientToList}
              />
            </div>
            <ul className="ml-5 list-disc mb-4">
              {ingredientsList.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
            <h2 className="text-md text-title font-semibold mb-2">
              Passos de preparo
            </h2>
            <div className="mb-4 flex">
              <input
                type="text"
                value={newPreparationStep}
                onKeyDown={(e) => {
                  if (e.key == "Enter") {
                    e.preventDefault()
                    addPreparationStepToList()
                  }
                }}
                onChange={(e) => setNewPreparationStep(e.target.value)}
                className="shadow appearance-none border rounded w-4/5 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Novo Passo de Preparo"
              />
              <Button
                type="button"
                title="Adicionar"
                width="w-1/5"
                onClick={addPreparationStepToList}
              />
            </div>
            <ul className="ml-5 list-decimal mb-4">
              {preparationMethodList.map((step, index) => (
                <li className="" key={index}>{step}</li>
              ))}
            </ul>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Tempo de Preparo (minutos)
              </label>
              <Input
                type="number"
                value={newPreparationTime}
                onChange={(e) => setNewPreparationTime(Number(e.target.value))}
                placeholder="Tempo"
                firstIcon={<AiOutlineClockCircle color="#667085" size={20} />}
              />
            </div>
            <div className="flex justify-end items-end mt-[30px] mb-[10px]">
              <Button
                type="submit"
                title="Salvar"
              />
            </div>
          </form>
          {/* <Button
            type="button"
            title="Gerar Receita Automática"
            onClick={openAlert} // Chama a função openAlert quando o botão é clicado
          /> */}
        </div>
      </Modal>
      <SidebarPage headerTitle="Minhas Receitas">
        <div className="flex flex-col w-full">
          <div className="h-[80vh] flex flex-col w-full pr-[100px] mt-[40px]">
            <Input
              value={filterText}
              onChange={(event) => setFilterText(event.target.value)}
              placeholder="Buscar..."
              firstIcon={<IoSearchOutline color="#667085" size={20} />}
              icon={
                <button onClick={() => setFilterText("")}>
                  <IoIosCloseCircleOutline color="#667085" size={20} />
                </button>
              }
            />
            <div className="flex justify-between items-center mt-[40px]">
              <h1 className="text-md text-subtitle self-end">Sua lista</h1>
              {visible && (
                <Button
                  title="Deletar"
                  width="w-[120px]"
                  marginBottom=""
                  backgroundColor="bg-remove"
                  onClick={() => {}}
                />
              )}
              <Button
                title="Adicionar"
                width="w-[120px]"
                marginBottom=""
                marginLeft="ml-[40px]"
                onClick={() => {
                  resetRecipeItemsInputs()
                  setOpenModal(true);
                }}
              />
            </div>
            <div className="w-full h-[100%] mt-[20px] overflow-y-scroll">
              {recipes.map((recipe: RecipeProps) => (
                <RecipeCard
                  key={recipe.id}
                  recipeProps={recipe}
                />
              ))}
            </div>
          </div>
        </div>
      </SidebarPage>
    </>
  );
};

export default MyRecipes;
