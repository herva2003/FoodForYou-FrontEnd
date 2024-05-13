import React, { memo } from "react";
import Checkbox from "./Checkbox";

interface IngredientCardProps {
  value: string;
  id: string;
  handleIngredientCheck: (data: any) => void;
}

const IngredientCard: React.FC<IngredientCardProps> = ({
  value,
  handleIngredientCheck,
  id,
}) => {
  const handleOnCheck = (checked: boolean) => {
    handleIngredientCheck({ value, checked, id });
  };

  return (
    <div
      className={
        "w-full h-[50px] bg-white flex items-center px-[10px] my-[10px] rounded-[4px] shadow-sm"
      }>
      <Checkbox onCheck={handleOnCheck} />
      <h1 className="pl-[10px] text-title">{value}</h1>
      {/* <IoIosRemoveCircle size={25} color="red" className="cursor-pointer" /> */}
    </div>
  );
};

export default memo(IngredientCard);
