import React from 'react';
import { IoIosRemoveCircle } from "react-icons/io";

interface IngredientCardProps {
    value: string;
}

const IngredientCard: React.FC<IngredientCardProps> = ({value}) => {
  return (
    <div className={"w-full h-[50px] bg-dark-white flex justify-between items-center px-[10px] rounded-lg"}>
        <h1>{value}</h1>
        <IoIosRemoveCircle size={25} color='red' className='cursor-pointer'/>
    </div>
  )
}

export default IngredientCard;