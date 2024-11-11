import React, { memo, useState, useEffect } from "react";
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
import { AiOutlineClockCircle, AiOutlineClose } from "react-icons/ai";
import { RecipeProps } from "../interfaces/RecipeProps";
import api from "../services/api";
import Swal from "sweetalert2";
import { FaStar } from "react-icons/fa6";
import { FaStarHalfAlt } from "react-icons/fa";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

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
  const [newReviewTitle, setNewReviewTitle] = useState("");
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (openModalRecipe) {
      fetchReviewsCount();
    }
  }, [openModalRecipe]);

  const fetchReviewsCount = async () => {
    try {
      const token = await getToken();
      const response = await api.get(`/api/v1/review/count?recipeId=${recipeProps.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        setReviewsCount(response.data);
      }
    } catch (error) {
      console.error("Error fetching reviews count:", error);
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
    console.log("Toggling nutritional values");
    setShowNutritionalValues(!showNutritionalValues);
  };

  const handleAddReview = async () => {
    try {
      const token = await getToken();
      console.log(`Adding review with token: ${token}`);

      const response = await api.post(
        `/api/v1/review/?recipeId=${recipeProps.id}`,
        {
          title: newReviewTitle,
          description: newReview,
          rating: rating,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        Swal.fire("Sucesso!", "Sua review foi adicionada.", "success");
        fetchRecipes();
        setNewReviewTitle("");
        setNewReview("");
        setRating(0);
        setShowReviewForm(false);
      }
    } catch (error) {
      console.error("Error adding review:", error);
      Swal.fire("Erro!", "Houve um erro ao adicionar a review.", "error");
    }
  };

  const nutritionalValueTranslation: { [key: string]: string } = {
    calcium_mg: "Cálcio",
    saturated_fats_g: "Gorduras Saturadas",
    carb_g: "Carboidratos",
    copper_mcg: "Cobre",
    energy_kcal: "Energia",
    fat_g: "Gordura",
    fiber_g: "Fibra",
    folate_mcg: "Folato",
    iron_mg: "Ferro",
    magnesium_mg: "Magnésio",
    manganese_mg: "Manganês",
    niacin_mg: "Niacina",
    phosphorus_mg: "Fósforo",
    potassium_mg: "Potássio",
    protein_g: "Proteína",
    riboflavin_mg: "Riboflavina",
    selenium_mcg: "Selênio",
    sodium_mg: "Sódio",
    sugar_g: "Açúcar",
    thiamin_mg: "Tiamina",
    vitA_mcg: "Vitamina A",
    vitB12_mcg: "Vitamina B12",
    vitB6_mg: "Vitamina B6",
    vitC_mg: "Vitamina C",
    vitD2_mcg: "Vitamina D2",
    vitE_mg: "Vitamina E",
    zinc_mg: "Zinco",
  };

  return (
    <div className="w-full h-[60px] bg-white flex items-center px-[10px] my-[10px] rounded-[4px] shadow-sm hover:shadow-md transition-shadow duration-200">
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
          style={{
            minWidth: "50%",
            minHeight: "50%",
            maxWidth: "90%",
            maxHeight: "90%",
            overflowY: "auto",
            background: "white",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <div className="flex justify-between items-center">
            <h1 className="text-md text-title font-semibold ">
              {recipeProps.name === "" ? (
                <span>Nome não adicionado</span>
              ) : (
                <span>{recipeProps.name}</span>
              )}
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
          <div className="flex m-4 items-center gap-2">
            <FaStar className="text-yellow-400" />
            <p className="text-sm font-bold text-gray-900 ">4.95</p>
            <span className="w-1 h-1 mx-1.5 bg-gray-500 rounded-full dark:bg-gray-400"></span>
            <a
              className="text-sm font-medium text-gray-900 underline hover:no-underline"
              onClick={() => navigate(`/reviews/${recipeProps.id}`, { state: { recipeProps } })}
              >
              {reviewsCount} reviews
            </a>
          </div>

          <div className="mb-6 flex items-center flex-col p-4 gap-2">
            <h2 className="font-semibold text-lg">Ingredientes</h2>
            {recipeProps.ingredients.length !== 0 ? (
              <ul className="list-none">
                {recipeProps.ingredients.map(
                  (
                    ingredient: { name: string; quantity: number },
                    index: number
                  ) => (
                    <li key={index}>
                      {ingredient.name.charAt(0).toUpperCase() +
                        ingredient.name.slice(1)}{" "}
                      - {ingredient.quantity}g
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p>Nenhum ingrediente especificado</p>
            )}
          </div>
          <div className="flex flex-col items-center">
            <h2 className="font-semibold text-lg mb-2">Preparo</h2>
            {recipeProps.preparationMethod.length !== 0 ? (
              <ul className="list-decimal">
                {recipeProps.preparationMethod.map(
                  (prep: string, index: number) => (
                    <li key={index}>
                      {prep.charAt(0).toUpperCase() + prep.slice(1)}
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p>Nenhuma preparação adicionada</p>
            )}
          </div>
          <div className="m-[40px] flex flex-col items-center">
            <h2 className="font-semibold mb-2">Tempo de Preparo</h2>
            <p className="flex items-center">
              <AiOutlineClockCircle
                color="#667085"
                size={20}
              ></AiOutlineClockCircle>
              &nbsp;
              {recipeProps.preparationTime === 0 ? (
                <span>Tempo não especificado</span>
              ) : (
                <span>{recipeProps.preparationTime} minutos</span>
              )}
            </p>
            {recipeProps.nutritionalValues && showNutritionalValues && (
              <div className="ml-4">
                <h2 className="font-semibold mb-2">Valores Nutricionais</h2>
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
              </div>
            )}
          </div>
          <div className="flex justify-center mb-4 gap-2">
            <button
              className="bg-red-500 text-white py-2 px-4 rounded"
              onClick={() => deleteRecipe(recipeProps.id)}
            >
              Excluir Receita
            </button>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded"
              onClick={toggleNutritionalValues}
            >
              {showNutritionalValues
                ? "Ocultar Valores Nutricionais"
                : "Mostrar Valores Nutricionais"}
            </button>
            <button
              className="bg-green-500 text-white py-2 px-4 rounded"
              onClick={() => setShowReviewForm(!showReviewForm)}
            >
              {showReviewForm ? "Ocultar Avaliação" : "Adicionar Avaliação"}
            </button>
          </div>
          {showReviewForm && (
            <div className="flex flex-col items-center mb-4">
              <h2 className="font-semibold text-lg">Adicionar Review</h2>
              <input
                type="text"
                className="border rounded p-2 w-full mb-2"
                placeholder="Título da review"
                value={newReviewTitle}
                onChange={(e) => setNewReviewTitle(e.target.value)}
              />
              <textarea
                rows={4}
                className="border rounded p-2 w-full"
                placeholder="Escreva seu comentário..."
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
              />
              <div className="flex items-center my-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setRating(star)}
                    className="cursor-pointer"
                  >
                    {star <= rating ? (
                      <FaStar className="text-yellow-500" />
                    ) : (
                      <FaStarHalfAlt className="text-yellow-500" />
                    )}
                  </span>
                ))}
              </div>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded"
                onClick={handleAddReview}
              >
                Adicionar Review
              </button>
            </div>
          )}
        </div>
      </Modal>

      <div className="recipe-card" onClick={() => setOpenRecipeModal(true)}>
        <h3>{recipeProps.name}</h3>
      </div>
    </div>
  );
};

export default memo(RecipeCard);