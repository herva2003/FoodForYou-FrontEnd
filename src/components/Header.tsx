import React from "react";
import Sidebar from "./Sidebar";

interface HeaderProps {
  visible: boolean;
  headerTitle: string;
}

const Header: React.FC<HeaderProps> = ({ visible, headerTitle }) => {
  return (
    <div
      className={`${
        visible ? "pl-[300px]" : "pl-[50px]"
      } w-full pt-[20px] ml-[40px] font-semibold bg-dark-white`}>
      <h1 className="text-title text-lg pb-[20px]">{headerTitle}</h1>
    </div>
  );
};

export default Header;
