import { createContext, useContext, useState } from "react";

interface IngredientsContextProviderProps {
  children: React.ReactNode;
}

interface IngredientsContextProps {
  selectedIngredients: Array<SelectedIngredientProps>;
  ingredients: Array<IngredientProps>;
  addIngredient: (id: string, value: string) => void;
  handleSetIngredients: (data: Array<IngredientProps>) => void;
}

export interface IngredientProps {
  id: string;
  protein_g: number;
  phosphorus_mg: number;
  potassium_mg: number;
  copper_mcg: number;
  magnesium_mg: number;
  manganese_mg: number;
  riboflavin_mg: number;
  niacin_mg: number;
  vitD2_mcg: number;
  energy_kcal: number;
  selenium_mcg: number;
  calcium_mg: number;
  thiamin_mg: number;
  vitB12_mcg: number;
  vitB6_mg: number;
  folate_mcg: number;
  sodium_mg: number;
  vitA_mcg: number;
  ndb_No: number;
  carb_g: number;
  fiber_g: number;
  sugar_g: number;
  iron_mg: number;
  zinc_mg: number;
  fat_g: number;
  vitC_mg: number;
  descrip: string;
  vitE_mg: number;
  saturated_fats_g: number;
}

interface SelectedIngredientProps {
  id: string;
  value: string;
}

const IngredientsContext = createContext<IngredientsContextProps>(
  {} as IngredientsContextProps
);

const IngredientsProvider: React.FC<IngredientsContextProviderProps> = ({
  children,
}) => {
  const [selectedIngredients, setSelectedIngredients] = useState<
    SelectedIngredientProps[]
  >([]);
  const [ingredients, setIngredients] = useState<IngredientProps[]>([]);

  const handleSetIngredients = (data: Array<IngredientProps>) => {
    setIngredients(data);
  };

  const addIngredient = (id: string, value: string) => {
    const copy = [...selectedIngredients];

    const item = copy.find((item) => item.id === id);

    if (!item) {
      copy.push({ id, value });
    }

    setSelectedIngredients(copy);
  };

  return (
    <IngredientsContext.Provider
      value={{
        selectedIngredients,
        addIngredient,
        handleSetIngredients,
        ingredients,
      }}>
      {children}
    </IngredientsContext.Provider>
  );
};

export default IngredientsProvider;

export const useIngredients = () => {
  const ingredientsState = useContext(IngredientsContext);
  return ingredientsState;
};
