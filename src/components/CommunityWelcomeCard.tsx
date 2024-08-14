import React from 'react';

interface CommunityWelcomeCardProps {
  userName: string;
}

const CommunityWelcomeCard: React.FC<CommunityWelcomeCardProps> = ({ userName }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <h1 className="text-2xl font-bold">Bem-vindo à Comunidade, {userName}!</h1>
      <p className="text-gray-700">Aqui você pode compartilhar e descobrir novas receitas, interagir com outros usuários e participar de discussões sobre alimentação saudável.</p>
    </div>
  );
};

export default CommunityWelcomeCard;