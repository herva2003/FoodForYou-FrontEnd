import React, { useState, ChangeEvent, FormEvent } from 'react';
import Input from '../components/Input';
import SidebarPage from '../components/SidebarPage';
import Button from '../components/Button';
import { TextareaAutosize } from '@mui/material';

interface Ingredient {
  _id: string;
  Descrip: string;
}

interface Quantity {
  Descrip: string;
  quantity: number;
}

interface Quantities {
  [key: string]: Quantity;
}

interface CalculatedValues {
  [key: string]: any;
}

const IA: React.FC = () => {
  const [textToProcess, setTextToProcess] = useState<string>('');
  const [result, setResult] = useState<Ingredient[]>([]);
  const [quantities, setQuantities] = useState<Quantities>({});
  const [calculatedValues, setCalculatedValues] = useState<CalculatedValues>({});
  
  const nutritionalValueTranslation: { [key: string]: string } = {
    'Calcium_mg': 'Cálcio',
    'Carb_g': 'Carboidratos',
    'Copper_mcg': 'Cobre',
    'Energy_kcal': 'Energia',
    'Fat_g': 'Gordura',
    'Fiber_g': 'Fibra',
    'Folate_mcg': 'Folato',
    'Iron_mg': 'Ferro',
    'Magnesium_mg': 'Magnésio',
    'Manganese_mg': 'Manganês',
    'Niacin_mg': 'Niacina',
    'Phosphorus_mg': 'Fósforo',
    'Potassium_mg': 'Potássio',
    'Protein_g': 'Proteína',
    'Riboflavin_mg': 'Riboflavina',
    'Selenium_mcg': 'Selênio',
    'Sodium_mg': 'Sódio',
    'Sugar_g': 'Açúcar',
    'Thiamin_mg': 'Tiamina',
    'VitA_mcg': 'Vitamina A',
    'VitB12_mcg': 'Vitamina B12',
    'VitB6_mg': 'Vitamina B6',
    'VitC_mg': 'Vitamina C',
    'VitD2_mcg': 'Vitamina D2',
    'VitE_mg': 'Vitamina E',
    'Zinc_mg': 'Zinco',
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:5000/process_text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text_to_process: textToProcess }),
      });

      const data: Ingredient[] = await response.json();

      setResult(data);

      const initialQuantities: Quantities = {};
      data.forEach(ingredient => {
        initialQuantities[ingredient._id] = {
          Descrip: ingredient.Descrip,
          quantity: 10,
        };
      });
      setQuantities(initialQuantities);
    } catch (error) {
      console.error('Error processing text:', error);
    }
  };

  const handleQuantityChange = (ingredientId: string, newQuantity: string) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [ingredientId]: {
        ...prevQuantities[ingredientId],
        quantity: parseInt(newQuantity, 10),
      },
    }));
  };

  const handleSendQuantities = async () => {
    const quantitiesToSend = Object.keys(quantities).map(key => ({
      _id: key,
      Descrip: quantities[key].Descrip,
      quantity: quantities[key].quantity,
    }));

    try {
      const response = await fetch('http://127.0.0.1:5000/send_quantities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quantitiesToSend),
      });

      const data: CalculatedValues = await response.json();

      setCalculatedValues(data);
    } catch (error) {
      console.error('Error sending quantities:', error);
    }
  };

  return (
    <SidebarPage headerTitle="Identificar Receita">
      <div className="">
        <div className="h-[80vh] pr-[100px] mt-[40px] flex justify-center">
          <div className="h-[100%] w-[50%]">
            <form onSubmit={handleSubmit}>
              <label className="block mb-2">
                Escreva a receita abaixo:
              </label>
              <TextareaAutosize
                  minRows={5}
                  className='
                  w-full
                  focus:ring-blue-500
                  focus:outline-none
                  focus:ring-2
                  border
                  border-gray-300
                  rounded-md
                  shadow-sm
                  mb-2
                  '
                  value={textToProcess}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setTextToProcess(e.target.value)}
                >
              </TextareaAutosize>
              <Button
              type="submit"
              title="Analisar receita"
              className=""
              />
            </form>
            <h2 className="text-md font-semibold my-2">Ingredientes encontrados:</h2>
            <ul className="pl-5 mb-4">
              {result.map((item) => (
                <li key={item._id} className="flex">
                  <span className="mr-2">{item.Descrip}</span>
                  <Input
                    type="number"
                    value={(quantities[item._id] && quantities[item._id].quantity) || ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleQuantityChange(item._id, e.target.value)}
                    className="w-20 text-sm px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </li>
              ))}
            </ul>
            <Button
              onClick={handleSendQuantities}
              title="Analisar calorias"
              key={"btnCalcCalories"}
              className=""
            />
            <div className="mt-2">
              <h2 className="text-md font-semibold my-2">Calorias calculadas:</h2>
              {Object.entries(calculatedValues).map(([key, value]) => (
                <div key={key} className="mb-2">
                  <h3 className="font-medium">{key}:</h3>
                  {typeof value === 'object' && value !== null ? (
                    Object.entries(value).map(([subKey, subValue]) => (
                      <p key={subKey}>
                        {nutritionalValueTranslation[subKey] || key}: {JSON.stringify(subValue)}
                      </p>
                    ))
                  ) : (
                    <p>{value}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SidebarPage>
  );
};

export default IA;
