import React, { useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FiEye, FiEyeOff } from "react-icons/fi";

import { useForm } from "react-hook-form";

import Button from "../components/Button";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { useAuth } from "../context/authContext";

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
    // const { email, password } = data;
    try {
      // const { data } = await api.post("/auth/login", {
      //   login: email,
      //   password: password,
      // });

      const data = { token: "1231253123" };

      if (data.token) {
        handleSetToken(data.token);
        navigate("/dashboard");
      } else {
        console.log("tratar erro");
      }
      console.log(data.token);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-screen flex w-screen px-8 py-8 border justify-center">
      <img
        src="src\assets\Logo.png"
        alt="company-logo"
        className="border border-red-500 absolute top-10 left-10 "
      />
      <div className="flex flex-row items-center">
        <div className="flex flex-col py-4 w-[360px] h-[550px] mx-28">
          <h1 className="font-main font-extrabold text-4xl mb-2">NFT Access</h1>
          <p className="mb-10 text-dark-grey">
            Please fill your detail to access your account
          </p>
          <form
            onSubmit={handleSubmit((data) =>
              handleSignIn(data as SignInRequest)
            )}>
            <Input
              {...register("email")}
              label="Email"
              placeholder="email"
              icon={
                <button onClick={() => reset({ email: "" })}>
                  <IoIosCloseCircleOutline color="#667085" size={20} />
                </button>
              }
            />
            <Input
              {...register("password")}
              label="Password"
              placeholder="password"
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
            />

            <div className="flex items-center justify-between mb-7">
              <div className="flex">
                <input type="checkbox" />
                <label className="ml-2">Remember me</label>
              </div>
              <Link to={""}>
                <p className="text-custom-blue">Forgot Password?</p>
              </Link>
            </div>

            <div>
              <Button type="submit" title="Sign In" />
              <Button
                outline
                type="submit"
                title="Sign in with Google"
                icon={<img src="src\assets\Google.png" alt="" />}
              />
            </div>
          </form>
          <div className="flex justify-center">
            <p className="text-sm text-darker-grey mr-2">
              Don't have an account?
            </p>
            <Link to={"/signUp"}>
              <p className="text-custom-blue text-sm">Sign up</p>
            </Link>
          </div>
        </div>

        <img
          src="src\assets\DRIP_20.png"
          alt=""
          className="w-[50%] h-[896px] max-h-[100%] bg-indigo-100 rounded-3xl"
        />
      </div>
    </div>
  );
};

export default SignIn;
