import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { RecipeIADTO, IngredientRecipeDTO } from "../interfaces/RecipeIADTO";
import { AiOutlineClockCircle } from "react-icons/ai";
import ingredientData from "../../ingredientes.json";
import nutritionalValueTranslation from "./NutritionalValueTranslation"

const RecipeCardForIA = ({ recipe }: { recipe: RecipeIADTO }) => {

    const getIngredientNameById = (oid: string): string => {
        const ingredient = ingredientData.find((ingredient: { oid: string; descrip: string }) => ingredient.oid === oid);
        console.log("ingrediente:", ingredient)
        return ingredient ? ingredient.descrip : "Ingrediente não encontrado";
    };

    return (
        <>
            <div className="flex justify-between items-center mb-[40px] border border-gray-200 rounded p-4 mt-5">
                <div>
                    <h1 className="text-md text-title font-semibold ">
                        {recipe.name === "" ? (<span>Nome não adicionado</span>) : (<span>{recipe.name}</span>)}
                    </h1>
                    <div className="flex items-center">
                        <p className="text-xs text-gray-500 mr-2">
                            Gerado em: {new Date(recipe.generatedAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <div className="ml-4">
                    <h2 className="font-semibold mb-2">Ingredientes</h2>
                    {recipe.ingredients.length !== 0 ? (
                        <ul className="ml-5 list-disc">
                            {recipe.ingredients.map((ingredient: IngredientRecipeDTO, index: number) => (
                                <li key={index}>
                                    {getIngredientNameById(ingredient.id).charAt(0).toUpperCase() + getIngredientNameById(ingredient.id).slice(1)} - {ingredient.quantity}g
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
                        <ul className="ml-5l">
                            {recipe.preparationMethod.map((prep: string, index: number) => (
                                <li key={index}>{prep}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>Nenhum método de preparação encontrado.</p>
                    )}
                </div>
                <div className="ml-4">
                    <h2 className="font-semibold mb-2">Tempo de preparo</h2>
                    <p className="flex items-center"><AiOutlineClockCircle color="#667085" size={20}></AiOutlineClockCircle>&nbsp;{recipe.preparationTime === 0 ?
                        (
                            <span>Tempo não especificado</span>
                        ) :
                        (
                            <span>{recipe.preparationTime} minutos</span>
                        )}</p>
                </div>
            </div>
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
                            .map(([key, value], index) => (
                                <TableRow key={index}>
                                    <TableCell component="th" scope="row">
                                        {nutritionalValueTranslation[key.toLowerCase()]}
                                    </TableCell>
                                    <TableCell align="right">{value}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </>
    );
};

export default RecipeCardForIA;