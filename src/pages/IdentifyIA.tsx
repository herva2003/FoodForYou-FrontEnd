import React, { useState, ChangeEvent, FormEvent } from 'react';
import Input from '../components/Input';
import SidebarPage from '../components/SidebarPage';
import Button from '../components/Button';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextareaAutosize } from '@mui/material';
import Swal from "sweetalert2"
import api from "../services/api"
import { useAuth } from "../context/authContext";

interface NutritionalValues {
  Calcium_mg: number;
  Carb_g: number;
  Copper_mcg: number;
  Energy_kcal: number;
  Fat_g: number;
  Fiber_g: number;
  Folate_mcg: number;
  Iron_mg: number;
  Magnesium_mg: number;
  Manganese_mg: number;
  Niacin_mg: number;
  Phosphorus_mg: number;
  Potassium_mg: number;
  Protein_g: number;
  Riboflavin_mg: number;
  Selenium_mcg: number;
  Sodium_mg: number;
  Sugar_g: number;
  Thiamin_mg: number;
  VitA_mcg: number;
  VitB6_mg: number;
  VitB12_mcg: number;
  VitC_mg: number;
  VitD2_mcg: number;
  VitE_mg: number;
  Zinc_mg: number;
}

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
  const [calculatedValuesTrue, setCalculatedValuesTrue] = useState<NutritionalValues>();
  const { getToken } = useAuth();
  
  const nutritionalValueTranslation: { [key: string]: string } = {
    'Calcium_mg': 'Cálcio mg',
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
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  
    try {
      Swal.fire({
        title: "Aguarde...",
        text: "Processando a receita...",
        icon: "info",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
  
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
  
      Swal.close();
      Swal.fire({
        title: "Sucesso!",
        text: "A receita foi processada com sucesso.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        title: "Erro!",
        text: "Houve um erro ao processar a receita. Por favor, tente novamente mais tarde.",
        icon: "error",
        timer: 3000,
        showConfirmButton: false,
      });
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
    try {
      Swal.fire({
        title: "Aguarde...",
        text: "Enviando quantidades...",
        icon: "info",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
  
      const quantitiesToSend = Object.keys(quantities).map(key => ({
        _id: key,
        Descrip: quantities[key].Descrip,
        quantity: quantities[key].quantity,
      }));

      console.log(quantitiesToSend)
  
      const response = await fetch('http://127.0.0.1:5000/send_quantities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quantitiesToSend),
      });
  
      const data: CalculatedValues = await response.json();
  
      setCalculatedValues(data.nutritional_values);
      setCalculatedValuesTrue(data.nutritional_values);
  
      Swal.fire({
        title: "Sucesso!",
        text: "As quantidades foram enviadas com sucesso.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        title: "Erro!",
        text: "Houve um erro ao enviar as quantidades. Por favor, tente novamente mais tarde.",
        icon: "error",
        timer: 3000,
        showConfirmButton: false,
      });
      console.error('Error sending quantities:', error);
    }
  };

  const handleSaveCalculatedValues = async () => {
    try {
      const token = await getToken();
      const response = await api.post("/api/v1/user/nv/", calculatedValuesTrue, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response) {
        Swal.fire({
          title: 'Salvo!',
          text: 'Os valores nutricionais foram salvos com sucesso.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
        setResult([]);
        setQuantities({});
        setCalculatedValues({});
        setTextToProcess('');
      } else {
        throw new Error('Failed to save nutritional values');
      }
    } catch (error) {
      Swal.fire({
        title: 'Erro!',
        text: 'Houve um erro ao salvar os valores nutricionais. Por favor, tente novamente mais tarde.',
        icon: 'error',
        timer: 3000,
        showConfirmButton: false,
      });
      console.error('Error saving nutritional values:', error);
    }
  };
  

  return (
    <SidebarPage headerTitle="Identificar Receita">
      <div className="">
      <div className="h-[80vh] pr-[100px] mt-[40px] flex justify-center overflow-auto">
          <div className="h-[100%] w-[80%]">
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
  <h2 className="text-md font-semibold my-2">Valores nutricionais da receita:</h2>
  {Object.keys(calculatedValues).length > 0 && (
    <TableContainer component={Paper} style={{ maxHeight: '400px', overflow: 'auto' }}>
      <Table aria-label="calculated-nutritional-values">
        <TableHead>
          <TableRow>
            <TableCell>Nutriente</TableCell>
            <TableCell align="right">Valor</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {Object.entries(calculatedValues).map(([nutrient, values]) => (
  <TableRow key={nutrient}>
    <TableCell component="th" scope="row">{nutritionalValueTranslation[nutrient]}</TableCell>
    <TableCell component="th" align="right" scope="row">{values}</TableCell>
  </TableRow>
))}

        </TableBody>
      </Table>
    </TableContainer>
  )}
</div>
<Button
              onClick={handleSaveCalculatedValues}
              title="Salvar Valores"
              className=""
            />


          </div>
        </div>
      </div>
    </SidebarPage>
  );
};

export default IA;
