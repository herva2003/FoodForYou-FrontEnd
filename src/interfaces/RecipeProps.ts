export interface RecipeProps {
    id: string;
    name: string;
    ingredients: string[];
    preparationMethod: string[];
    preparationTime: number;
    createdAt: String;
    nutritionalValues: NutritionalValues[];
}

interface NutritionalValues {
    [x: string]: string | number | readonly string[] | undefined;
    id: string;
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
    thiamin_mg: number;
    riboflavin_mg: number;
    niacin_mg: number;
    vitB6_mg: number;
    vitE_mg: number;
    doneAt: string;
}
