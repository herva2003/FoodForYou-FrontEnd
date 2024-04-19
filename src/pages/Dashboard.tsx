import React from "react";
import Input from "../components/Input";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useForm } from "react-hook-form";
import Button from "../components/Button";

const Dashboard: React.FC = () => {
  const { register, handleSubmit, reset } = useForm();

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
