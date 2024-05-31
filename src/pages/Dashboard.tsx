import React, { useEffect, useState } from "react";
import SidebarPage from "../components/SidebarPage";
import DashboardWelcomeCard from "../components/DashboardWelcomeCard";
import api from "../services/api"
import { UserProps } from "../interfaces/UserProps";


const Dashboard: React.FC = () => {
  const [userData, setUserData] = useState<UserProps | null>(null);

  const fetchData = async () => {
    try {
      const response = await api.get("/api/v1/user/me"); 
      const userDataFromApi: UserProps = response.data;
      setUserData(userDataFromApi);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  return (
    <>
    
      <SidebarPage headerTitle="Dashboard">
      <DashboardWelcomeCard 
        login={userData?.login ?? ""} 
        fullName={userData?.fullName ?? ""} 
        weight={userData?.weight ?? 0}
        height={userData?.height ?? 0}
      />
      </SidebarPage>
    </>
  );
};

export default Dashboard;
