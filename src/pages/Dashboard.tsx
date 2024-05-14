import React from "react";
import Input from "../components/Input";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useForm } from "react-hook-form";
import Button from "../components/Button";

const Dashboard: React.FC = () => {
  const { register, handleSubmit, reset } = useForm();

  return (
    <SidebarPage headerTitle="Dashboard">
      <div>
        <h1></h1>
      </div>
    </SidebarPage>
  );
};

export default Dashboard;
