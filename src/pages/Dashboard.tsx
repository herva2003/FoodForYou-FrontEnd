import React from "react";
import SidebarPage from "../components/SidebarPage";
import DashboardWelcomeCard from "../components/DashboardWelcomeCard";

const Dashboard: React.FC = () => {
  return (
    <SidebarPage headerTitle="Dashboard">
        <DashboardWelcomeCard login="johndoe@foodforyou.com" fullName="John Doe" height={180} weight={120}></DashboardWelcomeCard>
    </SidebarPage>
  );
};

export default Dashboard;
