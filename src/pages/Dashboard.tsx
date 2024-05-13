import React, { useEffect } from "react";
import SidebarPage from "../components/SidebarPage";
import api from "../services/api";
import { useIngredients } from "../context/ingredientsContext";

const Dashboard: React.FC = () => {
  const { handleSetIngredients } = useIngredients();

  const getIngredients = async () => {
    try {
      const response = await api.get("/api/user/ingredient");

      if (response.data) {
        handleSetIngredients(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getIngredients();
  }, []);

  return (
    <SidebarPage headerTitle="Dashboard">
      <div>
        <h1></h1>
      </div>
    </SidebarPage>
  );
};

export default Dashboard;
