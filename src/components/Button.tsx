// import React, { ButtonHTMLAttributes } from "react";

// interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
//   title: string;
//   icon?: React.ReactNode;
//   type?: "submit" | "reset" | "button" | undefined,
//   outline?: boolean;
//   onClick?: () => void;
//   width?: string;
//   marginBottom?: string;
//   marginRight?: string;
//   marginLeft?: string;
//   backgroundColor?: string;
// }

// const Button: React.FC<ButtonProps> = ({
//   title,
//   icon,
//   type,
//   outline,
//   onClick,
//   width,
//   marginBottom,
//   marginRight,
//   marginLeft,
//   backgroundColor,
// }) => {
//   return (
//     <>
//       {!outline ? (
//         <button
//           type={type}
//           onClick={onClick}
//           className={`${width ? width : "w-full"} h-[44px] shadow-sm ${
//             backgroundColor ? backgroundColor : "bg-primary"
//           } text-white rounded-[4px] ${marginBottom ? "mb-5" : marginBottom} ${
//             marginRight ? marginRight : ""
//           } ${marginLeft ? marginLeft : ""}`}>
//           <div className="items-center mr-2">{icon}</div>
//           <p className="text-white">{title}</p>
//         </button>
//       ) : (
//         <button className="w-full h-[44px] border border-custom-grey rounded-[7px] items-center justify-center flex mb-5">
//           <div className="items-center mr-2">{icon}</div>
//           <p className="text-title">{title}</p>
//         </button>
//       )}
//     </>
//   );
// };

// export default Button;
