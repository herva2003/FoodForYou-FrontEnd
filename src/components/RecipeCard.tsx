import { Modal } from "@mui/material";
import React, { memo, useState } from "react";
import { IoIosEye } from "react-icons/io";
import Button from "./Button";
import { AiOutlineClockCircle, AiOutlineClose, AiOutlineCloseCircle, AiOutlineCloseSquare } from "react-icons/ai";
import { RecipeProps } from "../interfaces/RecipeProps";
import api from "../services/api";
import Swal from "sweetalert2";

interface RecipeCardProps {
  recipeProps: RecipeProps,
  fetchRecipes: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipeProps, fetchRecipes }) => {
  const [openModalRecipe, setOpenRecipeModal] = useState(false);

  const deleteRecipe = async (id: string) => {
    try {
      closeModal()
      const confirmDelete = await Swal.fire({
        title: 'Tem certeza?',
        text: "Você não poderá reverter isso!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, exclua!',
        cancelButtonText: 'Cancelar'
      });
      if (confirmDelete.isConfirmed) {
        const response = await api.delete(`/api/v1/user/recipe/${id}`);
        if (response.status === 204) {
          Swal.fire(
            'Excluído!',
            'Sua receita foi excluída.',
            'success'
          );
          fetchRecipes();
          closeModal();
        }
      }
    } catch (error) {
      closeModal();
      Swal.fire(
        'Erro!',
        'Houve um erro ao excluir a receita.',
        'error'
      );
      console.error('Error deleting recipe:', error);
    }
  };

  const closeModal = () => {
    setOpenRecipeModal(false);
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
        open={openModalRecipe}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="min-w-[30vw] min-h-[30vh] bg-white rounded-[4px] py-[20px] px-[40px]">
          <div className="flex justify-between items-center mb-[40px]">
            <h1 className="text-md text-title font-semibold ">
              {recipeProps.name == "" ? (<span>Nome não adicionado</span>) : (<span>{recipeProps.name}</span>)}
            </h1>
            <AiOutlineClose
              size={25}
              className="cursor-pointer text-title"
              onClick={closeModal}
            />
          </div>
          <div className="mb-6">
            <h2 className="font-semibold mb-2">Ingredientes</h2>
            {recipeProps.ingredients.length!=0 ? (
              <ul className="ml-5 list-disc">
                {recipeProps.ingredients.map((ingredient: string) => (
                  <li>{ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}</li>
                ))}
              </ul>
            ):(
              <p>Nenhum ingrediente especificado</p>
            )}
            
          </div>
          <div className="mb-6">
            <h2 className="font-semibold mb-2">Preparação</h2>
            {recipeProps.preparationMethod.length!=0 ? (
              <ul className="ml-5 list-decimal">
                {
                recipeProps.preparationMethod.map((prep: string) => (
                  <li>{prep.charAt(0).toUpperCase() + prep.slice(1)}</li>
                ))}
              </ul>
            ):(
              <p>Nenhuma preparação adicionada</p>
            )}
          </div>
          <div className="mb-[40px]">
            <h2 className="font-semibold mb-2">Tempo de preparo</h2>
            <p className="flex items-center"><AiOutlineClockCircle color="#667085" size={20}></AiOutlineClockCircle>&nbsp;{
              recipeProps.preparationTime == 0 ? 
                (
                  <span>Tempo não especificado</span>
                ):
                (
                  <span>{recipeProps.preparationTime} minutos</span>
                )
            }</p>
          </div>
          <Button title="Excluir" backgroundColor="bg-red-500" onClick={() => deleteRecipe(recipeProps.id)}></Button>
        </div>
      </Modal>
      <div className="w-[99%] h-[50px] bg-white flex items-center justify-between px-[10px] my-[10px] rounded-[4px] shadow-sm">
        <h1 className="text-title">{recipeProps.name}</h1>
        <div className="flex items-center">
          <button 
            type="button" 
            className="h-[32px] w-[32px] rounded-[4px] border flex justify-center items-center"
            onClick={() => {
              setOpenRecipeModal(true);
            }}
          >
            <IoIosEye color="#667085" size={20} />
          </button>
          <span className="ml-[10px]">{recipeProps.preparationTime} minutos</span>
        </div>
      </div>
    </>
  );
};

export default memo(RecipeCard);
