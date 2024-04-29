import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  icon?: React.ReactNode;
  outline?: boolean;
}

const Button: React.FC<ButtonProps> = ({ title, icon, outline }) => {
  return (
    <>
      {!outline ? (
        <button className="w-full h-[44px] bg-custom-blue text-white rounded-[7px] mb-5">
          <div className="items-center mr-2">{icon}</div>
          <p className="text-white">{title}</p>
        </button>
      ) : (
        <button className="w-full h-[44px] border border-custom-grey rounded-[7px] items-center justify-center flex mb-5">
          <div className="items-center mr-2">{icon}</div>
          <p className="text-darker-grey">{title}</p>
        </button>
      )}
    </>
  );
};

export default Button;
