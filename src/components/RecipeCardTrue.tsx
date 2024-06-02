import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { RecipeIADTO } from "../interfaces/RecipeIADTO";
import { AiOutlineClockCircle } from "react-icons/ai";

const RecipeCardTrue = ({ recipe }: { recipe: RecipeIADTO }) => {
    const nutritionalValueTranslation: { [key: string]: string } = {
        'Calcium_mg': 'Cálcio mg',
        'Saturated_fats_g': 'Gorduras Saturadas',
        'Carb_g': 'Carboidratos g',
        'Copper_mcg': 'Cobre mcg',
        'Energy_kcal': 'Energia kcal',
        'Fat_g': 'Gordura g',
        'Fiber_g': 'Fibra g',
        'Folate_mcg': 'Folato mcg',
        'Iron_mg': 'Ferro mg',
        'Magnesium_mg': 'Magnésio mg',
        'Manganese_mg': 'Manganês mg',
        'Niacin_mg': 'Niacina mg',
        'Phosphorus_mg': 'Fósforo mg',
        'Potassium_mg': 'Potássio mg',
        'Protein_g': 'Proteína g',
        'Riboflavin_mg': 'Riboflavina mg',
        'Selenium_mcg': 'Selênio mcg',
        'Sodium_mg': 'Sódio mg',
        'Sugar_g': 'Açúcar g',
        'Thiamin_mg': 'Tiamina mg',
        'VitA_mcg': 'Vitamina A mcg',
        'VitB12_mcg': 'Vitamina B12 mcg',
        'VitB6_mg': 'Vitamina B6 mg',
        'VitC_mg': 'Vitamina C mg',
        'VitD2_mcg': 'Vitamina D2 mcg',
        'VitE_mg': 'Vitamina E mg',
        'Zinc_mg': 'Zinco mg',
      };

      console.log(recipe.nutritionalValues)

    return (
        <>
            <div className="flex justify-between items-center mb-[40px] border border-gray-200 rounded p-4 mt-5">
                <div>
                    <h1 className="text-md text-title font-semibold ">
                        {recipe.name === "" ? (<span>Nome não adicionado</span>) : (<span>{recipe.name}</span>)}
                    </h1>
                    <div className="flex items-center">
                        <p className="text-xs text-gray-500 mr-2">
                            Gerado em: {recipe.generatedAt}
                        </p>
                    </div>
                </div>
                <div className="ml-4">
                    <h2 className="font-semibold mb-2">Ingredientes</h2>
                    {recipe.ingredients.length !== 0 ? (
                        <ul className="ml-5 list-disc">
                            {recipe.ingredients.map((ingredient: { name: string; quantity: number; }, index: number) => (
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
                                        {nutritionalValueTranslation[key]}
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

export default RecipeCardTrue;
