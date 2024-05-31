import React, { useState, ChangeEvent, FormEvent } from 'react';
import Input from '../components/Input';
import SidebarPage from '../components/SidebarPage';
import Button from '../components/Button';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextareaAutosize } from '@mui/material';
import Swal from "sweetalert2"

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
  
      const response = await fetch('http://127.0.0.1:5000/send_quantities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quantitiesToSend),
      });
  
      const data: CalculatedValues = await response.json();
  
      setCalculatedValues(data.nutritional_values);
  
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
  
  return (
    <SidebarPage headerTitle="Identificar Receita">
      <div className="">
        <div className="h-[80vh] pr-[100px] mt-[40px] flex justify-center">
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
  <h2 className="text-md font-semibold my-2">Calorias calculadas:</h2>
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


          </div>
        </div>
      </div>
    </SidebarPage>
  );
};

export default IA;
