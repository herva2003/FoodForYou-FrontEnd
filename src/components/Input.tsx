import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, name, type = "text", ...rest }, ref) => {
    return (
      <div className="mb-3">
        <label className="font-main font-medium text-sm">{label}</label>
        <div className="relative w-full h-10">
          <input
            className="w-full h-full bg-transparent text-blue-gray-700 
            font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 
            disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 
            placeholder-shown:border-t-blue-gray-200 border focus:border-2 text-sm px-3 py-2.5 rounded-[7px] !pr-9 border-blue-gray-200 focus:border-gray-900"
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
