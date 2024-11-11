import React from 'react';

interface MyRecipesWelcomeCard {
  userName: string;
}

const MyRecipesWelcomeCard: React.FC<MyRecipesWelcomeCard> = ({ userName }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4 mr-24">
      <h1 className="text-2xl font-bold">Bem-vindo à suas receitas, {userName}!</h1>
      <p className="text-gray-700">Aqui você pode ver suas receitas!</p>
    </div>
  );
};

export default MyRecipesWelcomeCard;