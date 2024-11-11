import React, { memo } from "react";
import Checkbox from "./Checkbox";

interface IngredientCardProps {
  value: string;
  id: string;
  quantity: string;
  handleIngredientCheck: (data: any) => void;
}

const IngredientCard: React.FC<IngredientCardProps> = ({
  value,
  handleIngredientCheck,
  id,
  quantity,
}) => {
  const handleOnCheck = (checked: boolean) => {
    handleIngredientCheck({ value, checked, id, quantity });
  };

  return (
    <div className="w-full h-[60px] bg-white flex items-center px-[10px] my-[10px] rounded-[4px] shadow-sm hover:shadow-md transition-shadow duration-200">
      <Checkbox onCheck={handleOnCheck} />
      <div className="flex flex-col pl-[10px]">
        <h1 className="text-title font-semibold">{value}</h1>
        <span className="text-sm text-gray-500">{quantity} gramas</span>
      </div>
    </div>
  );
};

export default memo(IngredientCard);