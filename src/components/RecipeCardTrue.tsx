
import { RecipeIADTO } from "../interfaces/RecipeIADTO";
import { AiOutlineClockCircle } from "react-icons/ai";

const RecipeCardTrue = ({ recipe }: { recipe: RecipeIADTO }) => {
    return (
        <div className="flex justify-between items-center mb-[40px] border border-gray-200 rounded p-4 mt-5">
            <div>
                <h1 className="text-md text-title font-semibold ">
                    {recipe.name === "" ? (<span>Nome não adicionado</span>) : (<span>{recipe.name}</span>)}
                </h1>
                <div className="flex items-center">
                    <p className="text-xs text-gray-500 mr-2">
                    Gereado em: {recipe.generatedAt}
                    </p>
                </div>
            </div>
            <div className="ml-4">
                <h2 className="font-semibold mb-2">Ingredientes</h2>
                {recipe.ingredients.length !== 0 ? (
  <ul className="ml-5 list-disc">
    {recipe.ingredients.map((ingredient: { name: string, quantity: number }, index: number) => (
      <li key={index}>
        {ingredient.name.charAt(0).toUpperCase() + ingredient.name.slice(1)} - {ingredient.quantity}g
      </li>
    ))}
  </ul>
) : (
              <p>Nenhum ingrediente especificado</p>
            )}
            </div>
            <div className="ml-4">
                <h2 className="font-semibold mb-2">Preparação</h2>
                {recipe.preparationMethod.length !== 0 ? (
                    <ul className="ml-5 list-decimal">
                        {recipe.preparationMethod.map((prep: string, index: number) => (
                            <li key={index}>{prep.charAt(0).toUpperCase() + prep.slice(1)}</li>
                        ))}
                    </ul>
                ) : (
                    <p>Nenhuma preparação adicionada</p>
                )}
            </div>
            <div className="ml-4">
                <h2 className="font-semibold mb-2">Tempo de preparo</h2>
                <p className="flex items-center"><AiOutlineClockCircle color="#667085" size={20}></AiOutlineClockCircle>&nbsp;{
                    recipe.preparationTime === 0 ?
                        (
                            <span>Tempo não especificado</span>
                        ) :
                        (
                            <span>{recipe.preparationTime} minutos</span>
                        )
                }</p>
            </div>
        </div>
    );
};

export default RecipeCardTrue;
