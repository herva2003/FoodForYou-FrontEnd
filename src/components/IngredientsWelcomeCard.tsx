import React from 'react';

interface IngredientsWelcomeCardProps {
  userName: string;
}

const IngredientsWelcomeCard: React.FC<IngredientsWelcomeCardProps> = ({ userName }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4 mr-24">
      <h1 className="text-2xl font-bold">Bem-vindo àos seu ingredientes, {userName}!</h1>
      <p className="text-gray-700">Aqui você informará seus ingredientes disponíveis para a geração das futuras receitas!</p>
    </div>
  );
};

export default IngredientsWelcomeCard;