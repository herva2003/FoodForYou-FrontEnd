import React from 'react';
import { RecipeProps } from '../interfaces/RecipeProps';

interface RecipeCard2Props {
  recipe: RecipeProps;
}
  
const RecipeCard2: React.FC<RecipeCard2Props> = ({ recipe }) => {
  if (!recipe.nutritionalValues) {
    return <div>Dados nutricionais não disponíveis</div>;
  }

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
          <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Curtir</button>
          <button className="bg-green-500 text-white px-4 py-2 rounded">Comentar</button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard2;