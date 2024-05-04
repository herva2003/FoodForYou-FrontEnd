import React, { useEffect } from "react";
import Input from "../components/Input";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useForm } from "react-hook-form";
import Button from "../components/Button";
import api from "../services/api"
import { useAuth } from "../context/authContext";

const Dashboard: React.FC = () => {
  const { register, handleSubmit, reset } = useForm();
  const { getToken } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = await getToken(); 
      console.log(token)
      const response = await api.get("/user/me", {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      });
      console.log(response.data)
    } catch (error) {
      console.error("Erro ao obter dados do usuário:", error);
    }
  };

  return (
    <>
      <h1>DASHBOARD</h1>
      <div>
        <form onSubmit={handleSubmit((data) => console.log(data))}>
          <Input
            {...register("email")}
            label="Email"
            icon={
              <button onClick={() => reset({ email: "" })}>
                <IoIosCloseCircleOutline color="#667085" size={20} />
              </button>
            }
          />
          <Input
            {...register("name")}
            label="Name"
            icon={<IoIosCloseCircleOutline color="#667085" size={20} />}
          />
          <Input
            {...register("password")}
            label="Password"
            icon={<IoIosCloseCircleOutline color="#667085" size={20} />}
          />

          <Button title={"ENVIAR"} type="submit" />
        </form>
      </div>
    </>
  );
};

export default Dashboard;
