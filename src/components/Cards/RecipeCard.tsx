import React, { memo, useState, useEffect, useRef } from "react";
import {
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  AiOutlineClockCircle,
  AiOutlineClose,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import { RecipeProps } from "../../interfaces/RecipeProps";
import api from "../../services/api";
import Swal from "sweetalert2";
import { FaStar } from "react-icons/fa6";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import TutorialRecipeCard from "../Tutorials/TutorialRecipeCard";
import nutritionalValueTranslation from "../NutritionalValueTranslation";

interface RecipeCardProps {
  recipeProps: RecipeProps;
  fetchRecipes: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  recipeProps,
  fetchRecipes,
}) => {
  const { getToken } = useAuth();
  const [openModalRecipe, setOpenRecipeModal] = useState(false);
  const [showNutritionalValues, setShowNutritionalValues] = useState(true);
  const [rating, setRating] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (openModalRecipe) {
      fetchReviewsCount();
      fetchReviewRating();
    }
  }, [openModalRecipe]);

  const fetchReviewsCount = async () => {
    try {
      const token = await getToken();
      const response = await api.get(
        `/api/v1/review/count?recipeId=${recipeProps.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data) {
        setReviewsCount(response.data);
      }
    } catch (error) {
      console.error("Error fetching reviews count:", error);
    }
  };

  const fetchReviewRating = async () => {
    try {
      const token = await getToken();
      const response = await api.get(
        `/api/v1/review/rating?recipeId=${recipeProps.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data) {
        setRating(response.data);
      }
    } catch (error) {
      console.error("Error fetching review rating:", error);
    }
  };

  const deleteRecipe = async (id: string) => {
    try {
      closeModal();
      const confirmDelete = await Swal.fire({
        title: "Tem certeza?",
        text: "Você não poderá reverter isso!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, exclua!",
        cancelButtonText: "Cancelar",
      });
      if (confirmDelete.isConfirmed) {
        const response = await api.delete(`/api/v1/user/recipe/${id}`);
        if (response.status === 204) {
          closeModal();
          Swal.fire("Excluído!", "Sua receita foi excluída.", "success");
          fetchRecipes();
        }
      }
    } catch (error) {
      closeModal();
      Swal.fire("Erro!", "Houve um erro ao excluir a receita.", "error");
      console.error("Error deleting recipe:", error);
    }
  };

  const closeModal = () => {
    setOpenRecipeModal(false);
  };

  const toggleNutritionalValues = () => {
    setShowNutritionalValues(!showNutritionalValues);
  };

  return (
    <div className="w-full h-[70px] bg-white flex items-center px-[10px] my-[10px] rounded-[4px] shadow-sm hover:shadow-md transition-shadow duration-200">
      <TutorialRecipeCard />
      <Modal
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        open={openModalRecipe}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div
          ref={modalRef}
          className="w-[80vh] max-h-[80vh] overflow-auto bg-white rounded-[12px] p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-md text-title font-semibold">
              {recipeProps.name || "Nome não adicionado"}
            </h1>
            <div className="flex items-center">
              <p className="text-xs text-gray-500 mr-2">
                Criado em: {recipeProps.createdAt}
              </p>
              <AiOutlineClose
                size={25}
                className="cursor-pointer text-title"
                onClick={closeModal}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <FaStar className="text-yellow-400" />
            <p className="text-sm font-bold text-gray-900">{rating}</p>
            <span className="w-1 h-1 mx-1.5 bg-gray-500 rounded-full dark:bg-gray-400"></span>
            <button
              className="text-sm font-medium text-gray-900 underline hover:no-underline see_avaliacao"
              onClick={() =>
                navigate(`/reviews/${recipeProps.id}`, {
                  state: { recipeProps },
                })
              }
            >
              {reviewsCount} reviews
            </button>
          </div>

          <div className="mb-6">
            <h2 className="font-semibold text-lg mb-2">Ingredientes</h2>
            {recipeProps.ingredients.length ? (
              <ul className="list-none">
                {recipeProps.ingredients.map((ingredient, index) => (
                  <li key={index}>
                    {`${
                      ingredient.name.charAt(0).toUpperCase() +
                      ingredient.name.slice(1)
                    } - ${ingredient.quantity}g`}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nenhum ingrediente especificado</p>
            )}
          </div>

          <div className="flex flex-col mb-6">
            <h2 className="font-semibold text-lg mb-2">Preparo</h2>
            {recipeProps.preparationMethod.length ? (
              <ul>
                {recipeProps.preparationMethod.map((prep, index) => (
                  <li key={index}>
                    {prep.charAt(0).toUpperCase() + prep.slice(1)}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nenhuma preparação adicionada</p>
            )}
          </div>

          <div className="mb-6">
            <h2 className="font-semibold mb-2">Tempo de Preparo</h2>
            <p className="flex items-center">
              <AiOutlineClockCircle color="#667085" size={20} />
              &nbsp;
              {recipeProps.preparationTime ? (
                <span>{recipeProps.preparationTime} minutos</span>
              ) : (
                <span>Tempo não especificado</span>
              )}
            </p>
          </div>

          {recipeProps.nutritionalValues && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold">Valores Nutricionais</h2>
                <button
                  className="text-blue-500 flex items-center"
                  onClick={toggleNutritionalValues}
                >
                  {showNutritionalValues ? (
                    <AiOutlineEyeInvisible size={20} />
                  ) : (
                    <AiOutlineEye size={20} />
                  )}
                  <span className="ml-2">
                    {showNutritionalValues ? "Ocultar" : "Mostrar"}
                  </span>
                </button>
              </div>
              {showNutritionalValues && (
                <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                  <Table stickyHeader aria-label="nutritional values table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Nutrientes</TableCell>
                        <TableCell align="right">Valor</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(recipeProps.nutritionalValues)
                        .filter(([key]) => key !== "id")
                        .map(([key, value], index) => (
                          <TableRow key={index}>
                            <TableCell component="th" scope="row">
                              {nutritionalValueTranslation[key]}
                            </TableCell>
                            <TableCell align="right">{value}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </div>
          )}
          <div className="flex justify-center gap-2">
            <button
              className="bg-red-500 text-white py-2 px-4 rounded"
              onClick={() => deleteRecipe(recipeProps.id)}
            >
              Excluir Receita
            </button>
          </div>
        </div>
      </Modal>

      <div className="recipe-card" onClick={() => setOpenRecipeModal(true)}>
        <h3>{recipeProps.name}</h3>
      </div>
    </div>
  );
};

export default memo(RecipeCard);