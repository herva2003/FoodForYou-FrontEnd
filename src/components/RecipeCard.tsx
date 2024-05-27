import React, { memo } from "react";

interface RecipeCardProps {
  name: string;
  preparationTime: number;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ name, preparationTime }) => {
  return (
    <div className="w-full h-[50px] bg-white flex items-center px-[10px] my-[10px] rounded-[4px] shadow-sm">
      <h1 className="text-title">{name}</h1>
      <span className="ml-auto">{preparationTime} minutos</span>
    </div>
  );
};

export default memo(RecipeCard);
