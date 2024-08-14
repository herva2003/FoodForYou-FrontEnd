import React, { useEffect, useState } from "react";
import SidebarPage from "../components/SidebarPage";
import CommunityWelcomeCard from "../components/CommunityWelcomeCard";
import CommunityFeed from "../components/CommunityFeed";
import api from "../services/api";
import { UserProps } from "../interfaces/UserProps";
import { RecipeProps } from "../interfaces/RecipeProps";

const Community: React.FC = () => {
  const [userData, setUserData] = useState<UserProps | null>(null);
  const [recipes, setRecipes] = useState<RecipeProps[]>([]);

  const fetchUserData = async () => {
    try {
      const response = await api.get("/api/v1/user/me");
      const userDataFromApi: UserProps = response.data;
      setUserData(userDataFromApi);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchRecipes = async () => {
    try {
      const response = await api.get("/api/v1/recipe/getRecipes");
      const recipesFromApi: RecipeProps[] = response.data;
      setRecipes(recipesFromApi);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchRecipes();
  }, []);

  return (
    <SidebarPage headerTitle="Comunidade">
      <div className="h-[80vh] pr-[100px] overflow-y-auto">
        <CommunityWelcomeCard userName={userData?.fullName ?? "Usuário"} />
        <div className="mt-8">
          <CommunityFeed recipes={recipes} />
        </div>
      </div>
    </SidebarPage>
  );
};

export default Community;