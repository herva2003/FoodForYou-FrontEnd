import React, { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { SidebarData } from "../../global";
import { useNavigate } from "react-router-dom";
import { IoMenuSharp } from "react-icons/io5";

interface SidebarProps {
  visible: boolean;
  setVisible: (s: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ visible, setVisible }) => {
  const navigate = useNavigate();

  return (
    <>
      {visible ? (
        <>
          <div className="absolute top-0 bottom-0 left-0 w-[300px] h-[100vh] bg-white ">
            <div
              onClick={() => setVisible(false)}
              className="flex cursor-pointer self-end ml-auto p-[20px]">
              <IoMenuSharp size={30} className="ml-auto" />
            </div>
            <div className="w-full h-[150px] p-[10px]"></div>
            <div className="w-full h-full justify-center">
              <ul className="">
                {SidebarData.map((item) => (
                  <li
                    onClick={() => navigate(item.link)}
                    key={item.name}
                    className={`text-white ${
                      window.location.pathname === item.link
                        ? "bg-dark-white"
                        : "bg-white"
                    } flex flex-row items-center hover:bg-dark-white cursor-pointer`}>
                    <div className="m-5">
                      <item.icon
                        className={`${
                          window.location.pathname === item.link
                            ? "text-primary"
                            : "text-title"
                        }`}
                      />
                    </div>
                    <h1
                      className={`${
                        window.location.pathname === item.link
                          ? "text-primary"
                          : "text-title"
                      }`}>
                      {item.name}
                    </h1>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      ) : (
        <div
          onClick={() => setVisible(true)}
          className="flex cursor-pointer w-[30px] h-[30px] mt-[15px] ml-[20px]">
          <IoMenuSharp size={30} className="mr-0 text-title " />
        </div>
      )}
    </>
  );
};

export default Sidebar;
