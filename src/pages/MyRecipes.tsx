import React, { useState, useEffect } from "react";
import SidebarPage from "../components/SidebarPage";
import RecipeCard from "../components/RecipeCard";
import api from "../services/api";
import Button from "../components/Button";
import Input from "../components/Input";
import { useAuth } from "../context/authContext";
import { Modal } from "@mui/material";
import { AiOutlineCloseCircle, AiOutlinePlus } from "react-icons/ai";

interface RecipeProps {
  id: string;
  name: string;
  ingredients: string[];
  preparationMethod: string[];
  preparationTime: number;
}

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
  const [type, setType] = useState("");
  const [observation, setObservation] = useState("");
  const { getToken } = useAuth();
  const [generatedRecipe, setGeneratedRecipe] = useState<GeneratedRecipe | null>(null);

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

  console.log(generatedRecipe)


  const generatedRecipeFromIa = async () => {
    try {
      const token = await getToken();
      const requestBody = { type , observation };
  
      const response = await api.post("/api/v1/recipe/generate", requestBody, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log(response); 
  
      if (response.data) {
        console.log(response.data)
       await  setGeneratedRecipe(response.data)
       loadDataFromAI()
      }
    } catch (error) {
      console.log(error);
    }
  };

  const submitAddedRecipe = async () => {
    try {
      const token = await getToken();
      const formData = getFormData();
  
      const response = await api.post("/api/v1/user/recipe", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log(response);
  
      if (response.data) {
        fetchRecipes();
        setOpenModal(false);
        console.log("Dados enviados com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao enviar os dados:");
    }
  };
  


  const openAlert = () => {
    const tipoValue = prompt("Digite o tipo:");
    const obesetatiionValue = prompt("Digite a obesetatiion:");
    if (tipoValue && obesetatiionValue) {
      setType(tipoValue);
      setObservation(obesetatiionValue);
      generatedRecipeFromIa();
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

  const loadDataFromAI = () => {
    if (generatedRecipe) {
      setNewRecipeName(generatedRecipe.name || "");
      setIngredientsList(generatedRecipe.ingredients || []);
      setPreparationMethodList(generatedRecipe.preparationMethod || []);
      setNewPreparationTime(generatedRecipe.preparationTime || 0);
    }
  };
  
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
        <div className="w-[70vw] h-[90vh] bg-white rounded-[4px] py-[20px] px-[40px]">
          <div className="flex justify-between items-center mb-[40px]">
            <h1 className="text-md text-title font-semibold ">
              Adicionar Nova Receita
            </h1>
            <AiOutlineCloseCircle
              size={30}
              className="cursor-pointer text-title"
              onClick={closeModal}
            />
          </div>
          <form onSubmit={submitAddedRecipe}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Nome da Receita
              </label>
              <input
                type="text"
                value={newRecipeName}
                onChange={(e) => setNewRecipeName(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Nome da Receita"
              />
            </div>
            <div className="mb-4 flex">
              <input
                type="text"
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Novo Ingrediente"
              />
              <Button
                type="button"
                title="add"
                onClick={addIngredientToList}
              />
            </div>
            <ul>
              {ingredientsList.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
            <div className="mb-4 flex">
              <input
                type="text"
                value={newPreparationStep}
                onChange={(e) => setNewPreparationStep(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Novo Passo de Preparo"
              />
              <Button
                type="button"
                title="add"
                onClick={addPreparationStepToList}
              />
            </div>
            <ul>
              {preparationMethodList.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Tempo de Preparo (minutos)
              </label>
              <input
                type="number"
                value={newPreparationTime}
                onChange={(e) => setNewPreparationTime(Number(e.target.value))}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Tempo de Preparo"
              />
            </div>
            <div className="flex justify-end items-end mt-[30px]">
              <Button
                type="submit"
                title="Salvar"
                width="w-[10%]"
              />
            </div>
          </form>
          <Button
            type="button"
            title="Gerar Receita Automática"
            onClick={openAlert} // Chama a função openAlert quando o botão é clicado
          />
        </div>
      </Modal>
      <SidebarPage headerTitle="Minhas Receitas">
        <div className="flex flex-col w-full">
          <div className="h-[80vh] flex flex-col w-full pr-[100px] mt-[40px]">
            <Input
              value={filterText}
              onChange={(event) => setFilterText(event.target.value)}
              placeholder="Buscar..."
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
                  setOpenModal(true);
                }}
              />
            </div>
            <div className="w-full h-[100%] mt-[20px] overflow-y-scroll">
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  name={recipe.name}
                  preparationTime={recipe.preparationTime}
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
