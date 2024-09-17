import React, { useState } from 'react';
import axios from 'axios';
import { RecipeProps } from '../interfaces/RecipeProps';
import { Comment } from '../interfaces/Comment';
import { Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Button } from '@mui/material';
import { AiOutlineClockCircle, AiOutlineClose } from 'react-icons/ai';
import { FaStar } from 'react-icons/fa6';

interface RecipeCard2Props {
  recipe: RecipeProps;
  userId: string;
}

const RecipeCard2: React.FC<RecipeCard2Props> = ({ recipe, userId }) => {
  const [isLiked, setIsLiked] = useState(recipe.likes.includes(userId));
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>(recipe.comments);
  const [openModal, setOpenModal] = useState(false);

  const handleLike = async () => {
    try {
      await axios.post(
        `http://localhost:8080/api/v1/recipes/${recipe.id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setIsLiked(true);
    } catch (error) {
      console.error('Error liking recipe:', error);
    }
  };

  const handleAddComment = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/v1/recipes/${recipe.id}/comment`,
        { content: newComment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
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
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4">
        <h2 className="text-xl font-bold">{recipe.name}</h2>
        <p className="text-gray-700">Tempo de preparo: {recipe.preparationTime} minutos</p>
        <h3 className="text-lg font-semibold mt-2">Ingredientes:</h3>
        <ul className="list-disc list-inside">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient.name} - {ingredient.quantity}</li>
          ))}
        </ul>
        <div className="mt-4">
          <button
            className={`bg-blue-500 text-white px-4 py-2 rounded mr-2 ${isLiked ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleLike}
            disabled={isLiked}
          >
            Curtir
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={handleOpenModal}
          >
            Comentar
          </button>
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
                {recipe.name === "" ? (
                  <span>Nome não adicionado</span>
                ) : (
                  <span>{recipe.name}</span>
                )}
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

            <div className="mb-6 flex items-center flex-col p-4 gap-2">
              <h2 className="font-semibold text-lg">Ingredientes</h2>
              {recipe.ingredients.length !== 0 ? (
                <ul className="list-none">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>
                      {ingredient.name.charAt(0).toUpperCase() +
                        ingredient.name.slice(1)}{" "}
                      - {ingredient.quantity}g
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Nenhum ingrediente especificado</p>
              )}
            </div>
            <div className="flex flex-col items-center">
              <h2 className="font-semibold text-lg mb-2">Preparação</h2>
              {recipe.preparationMethod.length !== 0 ? (
                <ul className="list-decimal">
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
            <div className="m-[40px] flex flex-col items-center">
              <h2 className="font-semibold mb-2">Tempo de Preparação</h2>
              <p className="flex items-center">
                <AiOutlineClockCircle
                  color="#667085"
                  size={20}
                ></AiOutlineClockCircle>
                &nbsp;
                {recipe.preparationTime === 0 ? (
                  <span>Tempo não especificado</span>
                ) : (
                  <span>{recipe.preparationTime} minutos</span>
                )}
              </p>
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
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Comentários:</h3>
              <ul className="list-disc list-inside">
                {comments.map((comment, index) => (
                  <li key={index}>
                    <p><strong>{comment.createdBy}:</strong> {comment.content}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4">
              <TextField
                label="Adicionar Comentário"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                className="mt-2"
                onClick={handleAddComment}
              >
                Adicionar Comentário
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default RecipeCard2;