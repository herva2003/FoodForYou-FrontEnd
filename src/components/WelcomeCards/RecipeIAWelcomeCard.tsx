import React from 'react';

const RecipeIAWelcomeCard: React.FC = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4 mr-24 mt-8">
      <h1 className="text-2xl font-bold">Bem-vindo a geração de receitas!</h1>
      <p className="text-gray-700">Aqui você poderá gerar receitas personalizadas de acordo com os ingredientes disponíveis</p>
    </div>
  );
};

export default RecipeIAWelcomeCard;