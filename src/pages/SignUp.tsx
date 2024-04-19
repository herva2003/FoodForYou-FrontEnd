import React, { useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FiEye, FiEyeOff } from "react-icons/fi";

import { useForm } from "react-hook-form";

import { Link } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";

const SignIn: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  return (
    <div className="h-screen flex w-screen px-8 py-8 border justify-center bg-indigo-100">
      <img
        src="src\assets\Logo.png"
        alt="company-logo"
        className="border border-red-500 absolute top-10 left-10 "
      />
      <img
        src="src\assets\DRIP_20.png"
        alt=""
        className="w-[600px] h-[600px] bg-indigo-100 rounded-3xl self-center"
      />
      <div className="flex flex-row bg-white rounded-3xl">
        <div className="flex flex-col py-4 w-[560px] h-[550px] mx-28 mt-20">
          <h1 className="font-main font-extrabold text-4xl mb-8">
            Sign up now
          </h1>
          <form onSubmit={handleSubmit((data) => console.log(data))}>
            <Input
              {...register("fullname")}
              placeholder="full name"
              icon={
                <button onClick={() => reset({ fullname: "" })}>
                  <IoIosCloseCircleOutline color="#667085" size={20} />
                </button>
              }
              label="Full name"
            />
            <Input
              {...register("email")}
              placeholder="email"
              icon={
                <button onClick={() => reset({ email: "" })}>
                  <IoIosCloseCircleOutline color="#667085" size={20} />
                </button>
              }
              label="Email"
            />
            <Input
              {...register("password")}
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
              label="Password"
            />
            <div className="flex justify-between">
              <div className="w-[65%]">
                <Input
                  {...register("document")}
                  placeholder="document"
                  icon={
                    <button onClick={() => reset({ document: "" })}>
                      <IoIosCloseCircleOutline color="#667085" size={20} />
                    </button>
                  }
                  label="Document"
                />
              </div>
              <div className="w-[30%]">
                <Input
                  {...register("balance")}
                  placeholder="weight"
                  icon={
                    <button onClick={() => reset({ balance: "" })}>
                      <IoIosCloseCircleOutline color="#667085" size={20} />
                    </button>
                  }
                  label="Weight"
                />
              </div>
            </div>
            <p className="text-xs text-custom-grey">
              You will be able change the weight later
            </p>

            <div className="flex my-5">
              <input type="checkbox" className="mr-2" />
              <p className="text-sm">
                By creating an account, I agree to our Terms of use and Privacy
                Policy
              </p>
            </div>
            <div className="flex mb-10">
              <input type="checkbox" className="mr-2 self-start" />
              <p className="text-sm self-start">
                By creating an account, I am also consenting to recieve SMS
                messages and emails, including product new feature updates,
                events, and marketing promotions
              </p>
            </div>

            <Button title="Sign Up" />
          </form>
          <div className="flex justify-center">
            <p className="text-sm text-darker-grey mr-2">
              Already have an account?
            </p>
            <Link to={"/signIn"}>
              <p className="text-custom-blue text-sm">Sign in</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
