import React, { useState } from "react";
import { Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { IoIosEye } from "react-icons/io";
import { AiOutlineClockCircle, AiOutlineClose } from "react-icons/ai";
import { RecipeProps } from "../interfaces/RecipeProps";

interface RecipeCard2Props {
  recipe: RecipeProps;
}

const RecipeCard2: React.FC<RecipeCard2Props> = ({ recipe }) => {
  const [openModal, setOpenModal] = useState(false);

  const closeModal = () => {
    setOpenModal(false);
  };

  const nutritionalValueTranslation: { [key: string]: string } = {
    'calcium_mg': 'Cálcio',
    'saturated_fats_g': 'Gorduras Saturadas',
    'carb_g': 'Carboidratos',
    'copper_mcg': 'Cobre',
    'energy_kcal': 'Energia',
    'fat_g': 'Gordura',
    'fiber_g': 'Fibra',
    'folate_mcg': 'Folato',
    'iron_mg': 'Ferro',
    'magnesium_mg': 'Magnésio',
    'manganese_mg': 'Manganês',
    'niacin_mg': 'Niacina',
    'phosphorus_mg': 'Fósforo',
    'potassium_mg': 'Potássio',
    'protein_g': 'Proteína',
    'riboflavin_mg': 'Riboflavina',
    'selenium_mcg': 'Selênio',
    'sodium_mg': 'Sódio',
    'sugar_g': 'Açúcar',
    'thiamin_mg': 'Tiamina',
    'vitA_mcg': 'Vitamina A',
    'vitB12_mcg': 'Vitamina B12',
    'vitB6_mg': 'Vitamina B6',
    'vitC_mg': 'Vitamina C',
    'vitD2_mcg': 'Vitamina D2',
    'vitE_mg': 'Vitamina E',
    'zinc_mg': 'Zinco',
  };

  return (
    <>
      <Modal
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        open={openModal}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div style={{
          minWidth: '50%',
          minHeight: '50%',
          maxWidth: '90%',
          maxHeight: '90%',
          overflowY: 'auto',
          background: 'white',
          borderRadius: '4px',
          padding: '20px',
        }}>
          <div className="flex justify-between items-center mb-[40px]">
            <h1 className="text-md text-title font-semibold">
              {recipe.name || "Nome não adicionado"}
            </h1>
            <div className="flex items-center">
              <p className="text-xs text-gray-500 mr-2">
                Criado em: {recipe.createdAt || "Data não disponível"}
              </p>
              <AiOutlineClose size={25} className="cursor-pointer text-title" onClick={closeModal} />
            </div>
          </div>
          <div className="mb-6">
            <h2 className="font-semibold mb-2">Ingredientes</h2>
            {recipe.ingredients && recipe.ingredients.length > 0 ? (
              <ul className="ml-5 list-disc">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>
                    {ingredient.name.charAt(0).toUpperCase() + ingredient.name.slice(1)} - {ingredient.quantity}g
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nenhum ingrediente especificado</p>
            )}
          </div>
          <div className="mb-6">
            <h2 className="font-semibold mb-2">Preparação</h2>
            {recipe.preparationMethod && recipe.preparationMethod.length > 0 ? (
              <ul className="ml-5 list-decimal">
                {recipe.preparationMethod.map((prep, index) => (
                  <li key={index}>{prep.charAt(0).toUpperCase() + prep.slice(1)}</li>
                ))}
              </ul>
            ) : (
              <p>Nenhuma preparação adicionada</p>
            )}
          </div>
          <div className="mb-[40px]">
            <h2 className="font-semibold mb-2">Tempo de preparo</h2>
            <p className="flex items-center"><AiOutlineClockCircle color="#667085" size={20}></AiOutlineClockCircle>&nbsp;{
              recipe.preparationTime ? `${recipe.preparationTime} minutos` : "Tempo não especificado"
            }</p>
            {recipe.nutritionalValues && (
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
                      {Object.entries(recipe.nutritionalValues)
                        .filter(([key]) => key !== 'id')
                        .map(([key, value], index) => (
                          <TableRow key={index}>
                            <TableCell component="th" scope="row">
                              {nutritionalValueTranslation[key] || key}
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
        </div>
      </Modal>
      <div className="w-[99%] h-[50px] bg-white flex items-center justify-between px-[10px] my-[10px] rounded-[4px] shadow-sm">
        <h1 className="text-title">{recipe.name}</h1>
        <div className="flex items-center">
          <button
            type="button"
            className="h-[32px] w-[32px] rounded-[4px] border flex justify-center items-center"
            onClick={() => {
              setOpenModal(true);
            }}
          >
            <IoIosEye color="#667085" size={20} />
          </button>
          <span className="ml-[10px]">{recipe.preparationTime} minutos</span>
        </div>
      </div>
    </>
  );
};

export default RecipeCard2;