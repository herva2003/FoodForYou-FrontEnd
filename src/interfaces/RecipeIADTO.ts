export interface RecipeIADTO {
    name: string;
    ingredients: IngredientRecipeDTO[];
    preparationMethod: string[];
    preparationTime: number;
    generatedAt: string; 
}

export interface IngredientRecipeDTO {
    name: string;
    quantity: number;
}