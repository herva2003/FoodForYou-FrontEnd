import { Comment } from './Comment';

export interface RecipeProps {
  id: string;
  name: string;
  ingredients: IngredientRecipe[];
  preparationMethod: string[];
  preparationTime: number;
  createdAt: String;
  nutritionalValues: NutritionalValues;
  description: string;
  image: string;
  likes: string[];
  comments: Comment[];
  reviewsCount: number[];
}

interface NutritionalValues {
  id: string;
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
  potassium_mg: number;
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

export interface IngredientRecipe {
  id: string;
  name: string;
  quantity: number;
}