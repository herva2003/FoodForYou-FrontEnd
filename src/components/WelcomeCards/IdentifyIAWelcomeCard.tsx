import React from 'react';

const IdentifyIAWelcomeCard: React.FC = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4 mr-24 mt-8">
      <h1 className="text-2xl font-bold">Bem-vindo a identificação de receitas e ingredientes!</h1>
      <p className="text-gray-700">Aqui você informará ingredientes e receitas consumidos por fora da aplicação!</p>
    </div>
  );
};

export default IdentifyIAWelcomeCard;