import React, { ButtonHTMLAttributes } from "react";

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  icon?: React.ReactNode;
  outline?: boolean;
  width?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, icon, width }) => {
  return (
    <>
        <button className={`${width} h-[44px] bg-custom-blue text-white rounded-[7px] mb-5`}>
          <div className="items-center mr-2">{icon}</div>
          <p className="text-white">{title}</p>
        </button>
  
    </>
  );
};

export default CustomButton;
