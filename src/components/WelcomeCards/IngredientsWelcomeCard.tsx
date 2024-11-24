import React from 'react';

const IngredientsWelcomeCard: React.FC = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <h1 className="text-2xl font-bold">Bem-vindo àos seu ingredientes!</h1>
      <p className="text-gray-700">Aqui você informará seus ingredientes disponíveis para a geração das futuras receitas!</p>
    </div>
  );
};

export default IngredientsWelcomeCard;