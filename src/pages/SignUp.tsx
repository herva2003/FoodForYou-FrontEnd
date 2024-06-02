import React, { useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FiEye, FiEyeOff } from "react-icons/fi";
import api from "../services/api"; // Importe o Axios

import { useForm } from "react-hook-form";

import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import Swal from "sweetalert2";
import { IoArrowUpOutline, IoKeyOutline, IoPersonOutline, IoVolumeHigh } from "react-icons/io5";
import { AiOutlineMail } from "react-icons/ai";
import { RiWeightLine } from "react-icons/ri";
interface FormData {
  fullName: string;
  email: string;
  password: string;
  height: string;
  weight: string;
}



const SignIn: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false); 

  const { register, handleSubmit, reset } = useForm<FormData>();

  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      const response = await api.post("/api/v1/auth/signup", data);
      if (response.status === 201) {
        Swal.fire({
          title: "Success!",
          text: "Your account has been created successfully.",
          icon: "success",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/signIn");
          }
        });
      }
      console.log(response.data);
    } catch (error) {
      console.error("Error sending data:", error);
      Swal.fire({
        title: "Error!",
        text: "An error occurred while creating your account.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="h-screen flex w-screen px-8 py-8 border justify-center bg-dark-white">
      <img
        src="/brand-logo.png"
        alt="company-logo"
        className=" absolute top-10 left-10 w-28"
      />
      <img
        src="src/assets/Spaghetti food image.png"
        alt=""
        className="w-[600px] h-[500px] mt-14 bg-dark-white rounded-3xl self-center"
      />
      <div className="flex flex-row bg-white rounded-3xl">
        <div className="flex flex-col py-4 w-[560px] h-[550px] mx-28 mt-20">
          <h1 className="font-main font-extrabold text-4xl mb-8">
            Registre-se agora
          </h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              {...register("fullName")}
              placeholder="Nome completo"
              backgroundColor="bg-dark-white"
              icon={
                <button onClick={() => reset({ fullName: "" })}>
                  <IoIosCloseCircleOutline color="#667085" size={20} />
                </button>
              }
              label="Nome completo"
              firstIcon={
                <IoPersonOutline color="#667085" size={20}></IoPersonOutline>
              }
            />
            <Input
              {...register("email")}
              backgroundColor="bg-dark-white"
              icon={
                <button onClick={() => reset({ email: "" })}>
                  <IoIosCloseCircleOutline color="#667085" size={20} />
                </button>
              }
              placeholder="Email"
              label="Email"
              firstIcon={
                <AiOutlineMail color="#667085" size={20}></AiOutlineMail>
              }
            />
            <Input
              {...register("password")}
              backgroundColor="bg-dark-white"
              icon={
                <button type="button">
                  {showPassword ? (
                    <FiEye
                    onClick={() => setShowPassword((state) => !state)}
                    color="#667085"
                    size={20}
                    />
                  ) : (
                    <FiEyeOff
                    onClick={() => setShowPassword((state) => !state)}
                    color="#667085"
                    size={20}
                    />
                  )}
                </button>
              }
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              label="Senha"
              firstIcon={
                <IoKeyOutline color="#667085" size={20}></IoKeyOutline>
              }
            />
            <div className="flex justify-between">
              <div className="w-[47%]">
                <Input
                  {...register("height")}
                  backgroundColor="bg-dark-white"
                  icon={
                    <button onClick={() => reset({ height: "" })}>
                      <IoIosCloseCircleOutline color="#667085" size={20} />
                    </button>
                  }
                  placeholder="Altura (cm)"
                  label="Altura"
                  firstIcon={
                    <IoArrowUpOutline color="#667085" size={20}></IoArrowUpOutline>
                  }
                />
              </div>
              <div className="w-[47%]">
                <Input
                  {...register("weight")}
                  backgroundColor="bg-dark-white"
                  icon={
                    <button onClick={() => reset({ weight: "" })}>
                      <IoIosCloseCircleOutline color="#667085" size={20} />
                    </button>
                  }
                  placeholder="Peso (kg)"
                  label="Peso"
                  firstIcon={
                    <RiWeightLine color="#667085" size={20}></RiWeightLine>
                  }
                />
                <p className="text-xs text-subtitle">
                  Você poderá trocar o peso depois
                </p>
              </div>
            </div>

            <div className="flex my-5">
              <input type="checkbox" className="mr-2" />
              <p className="text-sm">
                Ao criar a conta, você aceita nossos Termos de Uso e Políticas de Privacidade.
              </p>
            </div>
            <div className="flex mb-10">
              <input type="checkbox" className="mr-2 self-start" />
              <p className="text-sm self-start">
                Ao criar a conta, você aceita receber mensagens SMS e emails, incluindo atualizações do site, eventos, e promoções.
              </p>
            </div>

            <Button title="Criar conta" marginBottom="mb-[5px]" />
          </form>
          <div className="flex justify-center">
            <p className="text-sm text-title mr-2">Já possui uma conta?</p>
            <Link to={"/signIn"}>
              <p className="text-primary text-sm">Entrar</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
