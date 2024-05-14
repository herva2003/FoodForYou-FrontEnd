import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  firstIcon?: React.ReactNode;
  backgroundColor?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, backgroundColor, icon, firstIcon, name, type = "text", ...rest },
    ref
  ) => {
    return (
      <div className="mb-3">
        <label className="font-main font-medium text-sm">{label}</label>
        <div className="relative w-full h-[50px]">
          <div className="absolute grid w-5 h-5 place-items-center text-blue-gray-500 top-2/4 left-3 -translate-y-2/4">
            {firstIcon}
          </div>
          <input
            className={`w-full h-full ${
              backgroundColor ? backgroundColor : "bg-white"
            } outline outline-0 focus:border shadow-sm text-sm px-3 rounded-[4px] px-[40px]`}
            {...rest}
            type={type}
            name={name}
            ref={ref}
          />
          <div className="absolute grid w-5 h-5 place-items-center text-blue-gray-500 top-2/4 right-3 -translate-y-2/4">
            {icon}
          </div>
        </div>
      </div>
    );
  }
);

export default Input;
