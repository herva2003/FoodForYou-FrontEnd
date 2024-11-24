import React from "react";

const CommunityWelcomeCard: React.FC = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <h1 className="text-2xl font-bold">Bem-vindo à Comunidade!</h1>
      <p className="text-gray-700">
        Aqui você pode descobrir novas receitas geradas por outros usuários.
      </p>
    </div>
  );
};

export default CommunityWelcomeCard;
