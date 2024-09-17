import React from 'react';
import RecipeCard2 from './RecipeCard2';
import { RecipeProps } from '../interfaces/RecipeProps';

interface CommunityFeedProps {
  recipes: RecipeProps[];
  userId: string;
}

const CommunityFeed: React.FC<CommunityFeedProps> = ({ recipes, userId }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {recipes.map((recipe) => (
        <RecipeCard2 key={recipe.id} recipe={recipe} userId={userId} />
      ))}
    </div>
  );
};

export default CommunityFeed;