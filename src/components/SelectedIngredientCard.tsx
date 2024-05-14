import React from "react";
import { IoIosRemoveCircle } from "react-icons/io";

interface IngredientCardProps {
  name: string;
  onClickRemove: () => void;
}

const SelectedIngredientCard: React.FC<IngredientCardProps> = ({
  name,
  onClickRemove,
}) => {
  return (
    <div
      className={
        "w-full h-[50px] bg-dark-white flex justify-between items-center px-[10px] rounded-[4px] shadow-sm"
      }>
      <h1 className="text-sm text-subtitle">{name}</h1>
      <IoIosRemoveCircle
        size={25}
        color="red"
        className="cursor-pointer"
        onClick={onClickRemove}
      />
    </div>
  );
};

export default SelectedIngredientCard;
