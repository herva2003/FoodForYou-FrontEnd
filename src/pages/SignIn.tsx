import React, { useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FiEye, FiEyeOff } from "react-icons/fi";

import { useForm } from "react-hook-form";

import Button from "../components/Button";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { useAuth } from "../context/authContext";

import Swal from "sweetalert2"
import { IoKeyOutline, IoPerson, IoPersonOutline } from "react-icons/io5";

const SignIn: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { handleSetToken } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();

  interface SignInRequest {
    email: string;
    password: string;
  }

  const handleSignIn = async (data: SignInRequest) => {
    const { email, password } = data;
    try {
      const response = await api.post("/api/v1/auth/login", {
        login: email,
        password: password,
      });

      console.log(response);
      const responseData = response.data;
      const { accessToken, refreshToken } = responseData.data;

      if (accessToken && refreshToken) {
        handleSetToken(accessToken, refreshToken);
        navigate("/dashboard");
      } else {
        Swal.fire({
          title: "Error!",
          text: "Invalid credentials. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.log("Error during login request:", error);
      Swal.fire({
        title: "Error!",
        text: "An error occurred while attempting to login.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  

  return (
    <div className="h-screen flex w-screen px-8 py-8 border justify-center">
      <img
        src="/brand-logo.png"
        alt="company-logo"
        className=" absolute top-10 left-10 w-28"
      />
      <div className="flex flex-row items-center">
        <div className="flex flex-col py-4 w-[360px] h-[550px] mx-28">
          <h1 className="font-main font-extrabold text-4xl mb-2">FFY Acesso</h1>
          <p className="mb-10 text-title">
            Por favor preencha com suas credenciais para fazer login
          </p>
          <form
            onSubmit={handleSubmit((data) =>
              handleSignIn(data as SignInRequest)
            )}>
            <Input
              {...register("email")}
              label="Email"
              placeholder="Email"
              backgroundColor="bg-dark-white"
              icon={
                <button onClick={() => reset({ email: "" })}>
                  <IoIosCloseCircleOutline color="#667085" size={20} />
                </button>
              }
              firstIcon={
                <IoPersonOutline color="#667085" size={20}></IoPersonOutline>
              }
            />
            <Input
              {...register("password")}
              label="Senha"
              placeholder="Senha"
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
              firstIcon={
                <IoKeyOutline color="#667085" size={20}></IoKeyOutline>
              }
            />

            <div className="flex items-center justify-between mb-7">
              <div className="flex">
                <input type="checkbox" />
                <label className="ml-2">Lembrar de mim</label>
              </div>
              <Link to={""}>
                <p className="text-primary">Esqueceu sua senha?</p>
              </Link>
            </div>

            <div>
              <Button type="submit" title="Entrar" marginBottom="mb-[5px]" />
              <Button
                outline
                type="submit"
                title="Entrar com o Google"
                icon={<img src="src\assets\Google.png" alt="" />}
              />
            </div>
          </form>
          <div className="flex justify-center">
            <p className="text-sm title mr-2">Não tem uma conta?</p>
            <Link to={"/signUp"}>
              <p className="text-primary text-sm">Crie uma conta</p>
            </Link>
          </div>
        </div>

        <img
          src="src/assets/Food Image.png"
          alt=""
          className="w-[60%] h-[896px] max-h-[100%] bg-dark-white rounded-3xl justify-center"
        />
      </div>
    </div>
  );
};

export default SignIn;