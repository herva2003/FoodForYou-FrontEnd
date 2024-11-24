import React from "react";

const ForumWelcomeCard: React.FC = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <h1 className="text-2xl font-bold">Bem-vindo ào fórum!</h1>
      <p className="text-gray-700">
        Aqui você pode interagir com outros usuários e participar de discussões
        sobre alimentação saudável.
      </p>
    </div>
  );
};

export default ForumWelcomeCard;
