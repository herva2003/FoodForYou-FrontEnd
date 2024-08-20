import React, { memo, useState } from "react";
import {
  Modal,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { IoIosEye } from "react-icons/io";
import Button from "./Button";
import { AiOutlineClockCircle, AiOutlineClose } from "react-icons/ai";
import { RecipeProps } from "../interfaces/RecipeProps";
import api from "../services/api";
import Swal from "sweetalert2";
import { FaStar } from "react-icons/fa6";
import { FaStarHalfAlt } from "react-icons/fa";

interface RecipeCardProps {
  recipeProps: RecipeProps;
  fetchRecipes: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  recipeProps,
  fetchRecipes,
}) => {
  const [openModalRecipe, setOpenRecipeModal] = useState(false);
  const [showNutritionalValues, setShowNutritionalValues] = useState(true);

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

  const toggleNutritionalValues = () => {
    setShowNutritionalValues(!showNutritionalValues);
  };

  console.log(recipeProps.nutritionalValues);
  return (
    <>
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
            borderRadius: "4px",
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
              href="#carousel-section"
              className="text-sm font-medium text-gray-900 underline hover:no-underline"
            >
              73 reviews
            </a>
          </div>

          <div className="mb-6">
            <h2 className="font-semibold mb-2">Ingredientes</h2>
            {recipeProps.ingredients.length !== 0 ? (
              <ul className="ml-5 list-disc">
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
          <div className="mb-6">
            <h2 className="font-semibold mb-2">Preparação</h2>
            {recipeProps.preparationMethod.length !== 0 ? (
              <ul className="ml-5 list-decimal">
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
          <div className="mb-[40px]">
            <h2 className="font-semibold mb-2">Tempo de preparo</h2>
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
            {recipeProps.nutritionalValues && (
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
          <div className="mb-[40px]">
            <Button
              title="Excluir"
              backgroundColor="bg-red-500"
              onClick={() => deleteRecipe(recipeProps.id)}
            ></Button>
          </div>
          <div id="carousel-section" className="carousel carousel-start rounded-box space-x-4 p-4 max-w-fit">

            {/* Carousel Items */}
            <div className="carousel-item flex flex-col break-words max-w-sm bg-neutral rounded-box p-4 gap-6 items-center">              
                <p className="font-bold text-white text-lg">Theodoro Mimura</p>
                <p>This podcast is amazing! The storytelling and production quality are top-notch. I can't wait for the next episode!</p>
                <div className="text-yellow-400 flex flex-row">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStarHalfAlt />
                </div>
            </div>

            <div className="carousel-item flex flex-col break-words max-w-sm bg-neutral rounded-box p-4 gap-6 items-center">              
                <p className="font-bold text-white text-lg">Theodoro Mimura</p>
                <p>This podcast is amazing! The storytelling and production quality are top-notch. I can't wait for the next episode!</p>
                <div className="text-yellow-400 flex flex-row">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStarHalfAlt />
                </div>
            </div>

            <div className="carousel-item flex flex-col break-words max-w-sm bg-neutral rounded-box p-4 gap-6 items-center">              
                <p className="font-bold text-white text-lg">Theodoro Mimura</p>
                <p>This podcast is amazing! The storytelling and production quality are top-notch. I can't wait for the next episode!</p>
                <div className="text-yellow-400 flex flex-row">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStarHalfAlt />
                </div>
            </div>

            <div className="carousel-item flex flex-col break-words max-w-sm bg-neutral rounded-box p-4 gap-6 items-center">              
                <p className="font-bold text-white text-lg">Theodoro Mimura</p>
                <p>This podcast is amazing! The storytelling and production quality are top-notch. I can't wait for the next episode!</p>
                <div className="text-yellow-400 flex flex-row">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStarHalfAlt />
                </div>
            </div>

            <div className="carousel-item flex flex-col break-words max-w-sm bg-neutral rounded-box p-4 gap-6 items-center">              
                <p className="font-bold text-white text-lg">Theodoro Mimura</p>
                <p>This podcast is amazing! The storytelling and production quality are top-notch. I can't wait for the next episode!</p>
                <div className="text-yellow-400 flex flex-row">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStarHalfAlt />
                </div>
            </div>

            <div className="carousel-item flex flex-col break-words max-w-sm bg-neutral rounded-box p-4 gap-6 items-center">              
                <p className="font-bold text-white text-lg">Theodoro Mimura</p>
                <p>This podcast is amazing! The storytelling and production quality are top-notch. I can't wait for the next episode!</p>
                <div className="text-yellow-400 flex flex-row">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStarHalfAlt />
                </div>
            </div>

            <div className="carousel-item flex flex-col break-words max-w-sm bg-neutral rounded-box p-4 gap-6 items-center">              
                <p className="font-bold text-white text-lg">Theodoro Mimura</p>
                <p>This podcast is amazing! The storytelling and production quality are top-notch. I can't wait for the next episode!</p>
                <div className="text-yellow-400 flex flex-row">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStarHalfAlt />
                </div>
            </div>

            <div className="carousel-item flex flex-col break-words max-w-sm bg-neutral rounded-box p-4 gap-6 items-center">              
                <p className="font-bold text-white text-lg">Theodoro Mimura</p>
                <p>This podcast is amazing! The storytelling and production quality are top-notch. I can't wait for the next episode!</p>
                <div className="text-yellow-400 flex flex-row">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStarHalfAlt />
                </div>
            </div>
          </div>
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
          <span className="ml-[10px]">
            {recipeProps.preparationTime} minutos
          </span>
        </div>
      </div>
    </>
  );
};

export default memo(RecipeCard);
