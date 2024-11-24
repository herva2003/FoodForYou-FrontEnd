import React, { useState, useEffect } from "react";
import { RecipeProps } from "../../interfaces/RecipeProps";
import { Like } from "../../interfaces/Like";
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
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import { FaStar } from "react-icons/fa6";
import api from "../../services/api";
import { useAuth } from "../../context/authContext";
import nutritionalValueTranslation from "../NutritionalValueTranslation";
import { AxiosError } from "axios";
import Swal from "sweetalert2";
import ingredientData from "../../../ingredientes.json";
import { useNavigate } from "react-router-dom";

interface RecipeCardForCommunityProps {
  recipe: RecipeProps;
  userId: string;
}

const RecipeCardForCommunity: React.FC<RecipeCardForCommunityProps> = ({
  recipe,
  userId,
}) => {
  const [isLiked, setIsLiked] = useState(recipe.likes.includes(userId));
  const [openModal, setOpenModal] = useState(false);
  const [likes, setLikes] = useState<string[]>(recipe.likes);
  const { getToken } = useAuth();
  const [reviewsCount, setReviewsCount] = useState(0);
  const navigate = useNavigate();
  const [rating, setRating] = useState();
  const [showNutritionalValues, setShowNutritionalValues] = useState(true);

  useEffect(() => {
    if (openModal) {
      fetchReviewsCount();
      fetchReviewRating();
    }
  }, [openModal]);

  const fetchReviewsCount = async () => {
    try {
      const token = await getToken();
      const response = await api.get(
        `/api/v1/review/count?recipeId=${recipe.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("recipe:", recipe);
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
        `/api/v1/review/rating?recipeId=${recipe.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("recipeProps:", recipe);
      if (response.data) {
        setRating(response.data);
      }
    } catch (error) {
      console.error("Error fetching reviews count:", error);
    }
  };

  const handleLike = async () => {
    console.log("handleLike called");
    try {
      const data = { userId: userId, recipeId: recipe.id } as Like;
      const token = await getToken();
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      if (isLiked) {
        const response = await api.post(`/api/v1/recipe/unlike`, data, config);
        if (response) {
          setIsLiked(false);
          setLikes(likes.filter((id) => id !== userId));
        }
      } else {
        const response = await api.post(`/api/v1/recipe/like`, data, config);
        if (response) {
          setIsLiked(true);
          setLikes([...likes, userId]);
        }
      }
    } catch (error) {
      console.error("Error liking/unliking recipe:", error);
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Closing modal");
    setOpenModal(false);
  };

  const handleMakeRecipe = async (recipeId: string) => {
    try {
      console.log("Iniciando handleMakeRecipe para a receita:", recipeId);
      const token = await getToken();
      console.log("Token obtido:", token);

      const response = await checkAndRemoveIngredients(recipeId);

      console.log(
        "checkAndRemoveIngredients response status:",
        response.status
      );
      console.log("checkAndRemoveIngredients response data:", response.data);

      if (response.status === 200) {
        console.log(
          "Ingredientes suficientes. Adicionando valores nutricionais."
        );
        await addNutritionalValuesFromRecipe(recipeId);
      } else if (response.status === 400 && response.data.missingIngredients) {
        console.log(
          "Ingredientes insuficientes:",
          response.data.missingIngredients
        );

        const result = await Swal.fire({
          title: "Ingredientes insuficientes",
          text: "Deseja adicionar os ingredientes necessários à sua lista de compras?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Sim",
          cancelButtonText: "Não",
        });

        if (result.isConfirmed) {
          await addIngredientsToShoppingList(response.data.missingIngredients);
        }
      } else {
        console.log("Resposta inesperada:", response);
      }
    } catch (error) {
      console.log("Erro no handleMakeRecipe:", error);
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          const result = await Swal.fire({
            title: "Ingredientes insuficientes",
            text: "Deseja adicionar os ingredientes necessários à sua lista de compras?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sim",
            cancelButtonText: "Não",
          });

          console.log("Swal result (erro 400):", result);

          if (result.isConfirmed) {
            await addIngredientsToShoppingList(
              error.response.data.missingIngredients
            );
          }
        } else {
          console.log("makeRecipe error:", error);
          Swal.fire({
            title: "Erro!",
            text: "Ocorreu um erro ao fazer a receita.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } else {
        console.log("Unexpected error:", error);
        Swal.fire({
          title: "Erro!",
          text: "Ocorreu um erro inesperado.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  const checkAndRemoveIngredients = async (recipeId: string) => {
    try {
      const token = await getToken();
      const response = await api.post(
        `/api/v1/user/checkAndRemoveIngredients/${recipeId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("checkAndRemoveIngredients response:", response);
      return response;
    } catch (error) {
      console.error("Error checking and removing ingredients:", error);
      Swal.fire({
        title: "Erro!",
        text: "Houve um erro ao verificar e remover os ingredientes.",
        icon: "error",
        confirmButtonText: "OK",
      });
      throw error;
    }
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const createFormHtml = (missingIngredients: string[]) => {
    const form = document.createElement("form");

    missingIngredients.forEach((id) => {
      const ingredientDetail = ingredientData.find(
        (ingredient) => ingredient.oid === id
      );

      const div = document.createElement("div");
      div.style.display = "flex";
      div.style.justifyContent = "space-between";
      div.style.alignItems = "center";
      div.style.marginBottom = "10px";

      const label = document.createElement("label");
      label.setAttribute("for", `ingredient-${id}`);
      label.style.fontWeight = "bold";
      const ingredientName = ingredientDetail
        ? capitalizeFirstLetter(ingredientDetail.descrip)
        : id;
      label.textContent = `${ingredientName}`;
      div.appendChild(label);

      const input = document.createElement("input");
      input.setAttribute("id", `ingredient-${id}`);
      input.setAttribute("class", "swal2-input");
      input.setAttribute("placeholder", "Quantidade");
      input.style.width = "250px";
      input.style.marginLeft = "10px";
      div.appendChild(input);

      form.appendChild(div);
    });

    return form;
  };

  const addIngredientsToShoppingList = async (missingIngredients: string[]) => {
    const formHtml = createFormHtml(missingIngredients);

    const quantities = await Swal.fire({
      title: "Adicione as quantidades",
      html: formHtml,
      focusConfirm: false,
      preConfirm: () => {
        const inputs = missingIngredients.map((id) => {
          const quantity = (
            document.getElementById(`ingredient-${id}`) as HTMLInputElement
          ).value;
          return { ingredientId: id, quantity: quantity || "0" };
        });
        return inputs;
      },
    });

    if (!quantities.value) {
      console.error("Quantities value is undefined");
      return;
    }

    const ingredientsWithQuantities: {
      ingredientId: string;
      quantity: string;
    }[] = quantities.value;

    const token = await getToken();
    const responseAdd = await api.post(
      `/api/v1/user/addToShoppingList`,
      ingredientsWithQuantities,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log("addToShoppingList response:", responseAdd);
    console.log("missingIngredients:", ingredientsWithQuantities);
  };

  const addNutritionalValuesFromRecipe = async (recipeId: string) => {
    try {
      const token = await getToken();
      const response = await api.post(
        `/api/v1/user/nutritionalValuesFromRecipe/${recipeId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        Swal.fire({
          title: "Sucesso!",
          text: "Valores nutricionais adicionados ao usuário.",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error adding nutritional values:", error);
      Swal.fire({
        title: "Erro!",
        text: "Houve um erro ao adicionar os valores nutricionais.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const toggleNutritionalValues = () => {
    setShowNutritionalValues(!showNutritionalValues);
  };

  return (
    <div
      id="recipesCard"
      className="bg-white shadow-md rounded-lg overflow-hidden relative"
    >
      <div className="absolute top-4 right-4 text-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log("Like button clicked");
            handleLike();
          }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          {isLiked ? (
            <AiFillHeart size={24} color="red" />
          ) : (
            <AiOutlineHeart size={24} color="gray" />
          )}
        </button>
        <div style={{ marginTop: "4px", color: "gray" }}>{likes.length}</div>
      </div>
      <div
        className="p-4"
        onClick={handleOpenModal}
        style={{ cursor: "pointer" }}
      >
        <h2 className="text-xl font-bold">{recipe.name}</h2>
        <p className="text-gray-700">
          Tempo de preparo: {recipe.preparationTime} minutos
        </p>
        <h3 className="text-lg font-semibold mt-2">Ingredientes:</h3>
        <ul className="list-disc list-inside">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>
              {ingredient.name} - {ingredient.quantity}
            </li>
          ))}
        </ul>
      </div>

      <Modal
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="w-[80vh] max-h-[80vh] overflow-auto bg-white rounded-[12px] p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-md text-title font-semibold">
              {recipe.name || "Nome não adicionado"}
            </h1>
            <div className="flex items-center">
              <p className="text-xs text-gray-500 mr-2">
                Criado em: {recipe.createdAt}
              </p>
              <AiOutlineClose
                size={25}
                className="cursor-pointer text-title"
                onClick={handleCloseModal}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <FaStar className="text-yellow-400" />
            <p className="text-sm font-bold text-gray-900 ">{rating}</p>
            <span className="w-1 h-1 mx-1.5 bg-gray-500 rounded-full dark:bg-gray-400"></span>
            <button
              className="text-sm font-medium text-gray-900 underline hover:no-underline see_avaliacao"
              onClick={() =>
                navigate(`/reviews/${recipe.id}`, {
                  state: { recipeProps: recipe },
                })
              }
            >
              {reviewsCount} reviews
            </button>
          </div>

          <div className="mb-6">
            <h2 className="font-semibold text-lg mb-2">Ingredientes</h2>
            {recipe.ingredients.length ? (
              <ul className="list-none">
                {recipe.ingredients.map((ingredient, index) => (
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
            {recipe.preparationMethod.length ? (
              <ul>
                {recipe.preparationMethod.map((prep, index) => (
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
              {recipe.preparationTime ? (
                <span>{recipe.preparationTime} minutos</span>
              ) : (
                <span>Tempo não especificado</span>
              )}
            </p>
          </div>

          {recipe.nutritionalValues && (
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
                      {Object.entries(recipe.nutritionalValues)
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
              onClick={(e) => {
                handleMakeRecipe(recipe.id);
                handleCloseModal(e);
              }}
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-200"
            >
              Fazer Receita
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RecipeCardForCommunity;
