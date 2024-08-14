import React from 'react';
import RecipeCard2 from './RecipeCard2';
import { RecipeProps } from '../interfaces/RecipeProps';

interface CommunityFeedProps {
  recipes: RecipeProps[];
}

const CommunityFeed: React.FC<CommunityFeedProps> = ({ recipes }) => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Feed de Receitas</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map((recipe) => (
          <RecipeCard2 key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export default CommunityFeed;