import { createContext, useContext, useState } from "react";

interface IngredientsContextProviderProps {
    children: React.ReactNode;
  }
  
  interface IngredientsContextProps {
    ingredients: Array<IngredientProps>
    addIngredient: (id: string, value: string) => void;
  }

  interface IngredientProps {
    id: string;
    value: string
  }

const IngredientsContext = createContext<IngredientsContextProps>({} as IngredientsContextProps)

const IngredientsProvider: React.FC<IngredientsContextProviderProps> = ({children}) => {
  const [ingredients, setIngredients] = useState<IngredientProps[]>([]);

  const addIngredient = (id: string, value: string) => {
    const copy = [...ingredients];

    const item = copy.find((item) => item.id === id)

    if (!item) {
      copy.push({id, value})
    }

    setIngredients(copy)
  }

    return (
        <IngredientsContext.Provider value={{ingredients, addIngredient}}>
            {children}
        </IngredientsContext.Provider>
    )
}

export default IngredientsProvider;

export const useIngredients = () => {
    const ingredientsState = useContext(IngredientsContext);
    return ingredientsState;
  };