import React from 'react';

interface ShoppingListWelcomeCardProps {
  userName: string;
}

const ShoppingListWelcomeCard: React.FC<ShoppingListWelcomeCardProps> = ({ userName }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <h1 className="text-2xl font-bold">Bem-vindo à sua Lista de Compras, {userName}!</h1>
      <p className="text-gray-700">Aqui você gerenciará os ingredientes que precisa comprar para suas receitas!</p>
    </div>
  );
};

export default ShoppingListWelcomeCard;