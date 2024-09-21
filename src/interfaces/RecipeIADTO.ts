export interface RecipeIADTO {
    name: string;
    ingredients: IngredientRecipeDTO[];
    preparationMethod: string[];
    preparationTime: number;
    generatedAt: number; 
    nutritionalValues: NutritionalData;

}

export interface IngredientRecipeDTO {
    id: string;
    descrip: string;
    name: string;
    quantity: number;
}

interface NutritionalData {
    energy_kcal: number;
    protein_g: number;
    saturated_fats_g: number;
    fat_g: number;
    carb_g: number;
    fiber_g: number;
    sugar_g: number;
    calcium_mg: number;
    iron_mg: number;
    magnesium_mg: number;
    phosphorus_mg: number;
    Potassium_mg: number;
    sodium_mg: number;
    zinc_mg: number;
    copper_mcg: number;
    manganese_mg: number;
    selenium_mcg: number;
    vitC_mg: number;
    thiamin_mg: number;
    riboflavin_mg: number;
    niacin_mg: number;
    vitB6_mg: number;
    folate_mcg: number;
    vitB12_mcg: number;
    vitA_mcg: number;
    vitE_mg: number;
    vitD2_mcg: number;
  }