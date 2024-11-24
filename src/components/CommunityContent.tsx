import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import CommunityFeed from "../components/CommunityFeed";
import SearchBar from "../components/SearchBar";
import api from "../services/api";
import { UserProps } from "../interfaces/UserProps";
import { RecipeProps } from "../interfaces/RecipeProps";

const CommunityContent: React.FC = () => {
  const [userData, setUserData] = useState<UserProps | null>(null);
  const [recipes, setRecipes] = useState<RecipeProps[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUserData = async () => {
    try {
      const response = await api.get("/api/v1/user/me");
      const userDataFromApi: UserProps = response.data;
      setUserData(userDataFromApi);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchRecipes = async (page: number) => {
    try {
      const response = await api.get(
        `/api/v1/recipe/getRecipes?page=${page}&limit=9&search=${searchQuery}`
      );
      const recipesFromApi: RecipeProps[] = response.data;
      setRecipes(recipesFromApi);
      setHasMore(recipesFromApi.length === 9);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchRecipes(page);
  }, [page, searchQuery]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const handleNextPage = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="h-[73vh] pr-[100px] overflow-y-auto">
      <div id="search" className="mt-6">
        <SearchBar filterText={searchQuery} setFilterText={setSearchQuery} />
      </div>
      <div className="flex justify-between mt-4">
        <Button onClick={handlePrevPage} disabled={page === 1}>
          Anterior
        </Button>
        <Button onClick={handleNextPage} disabled={!hasMore}>
          Próxima
        </Button>
      </div>
      <div className="mt-8">
        <CommunityFeed recipes={recipes} userId={userData?.id ?? ""} />
      </div>
    </div>
  );
};

export default CommunityContent;
