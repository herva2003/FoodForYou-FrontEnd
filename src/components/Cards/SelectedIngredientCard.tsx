import React from "react";
import { IoIosRemoveCircle } from "react-icons/io";

interface IngredientCardProps {
  name: string;
  quantity: string;
  onQtdChange: (value: string) => void;
  onClickRemove: () => void;
}

const SelectedIngredientCard: React.FC<IngredientCardProps> = ({
  name,
  quantity,
  onQtdChange,
  onClickRemove,
}) => {
  return (
    <div className="w-full h-[50px] bg-dark-white flex justify-between items-center px-[10px] rounded-[4px] shadow-sm">
      <h1 className="text-sm text-subtitle truncate">{name}</h1>
      <div className="flex items-center">
        <input
          type="number"
          value={quantity}
          onChange={(e) => onQtdChange(e.target.value)}
          className="w-[100px] h-[36px] text-left border border-gray-300 rounded-[4px] px-[10px] mx-[10px]"
          placeholder="Gramas"
        />
        <IoIosRemoveCircle
          size={25}
          color="red"
          className="cursor-pointer"
          onClick={onClickRemove}
        />
      </div>
    </div>
  );
};

export default SelectedIngredientCard;
