import React, { useState } from "react";
import { SidebarData } from "../../global";
import { useNavigate } from "react-router-dom";
import { IoMenuSharp } from "react-icons/io5";

interface SidebarProps {
  visible: boolean;
  setVisible: (s: boolean) => void;
}

const setSidebarState = (visible: boolean) => {
  localStorage.setItem("sidebarState", visible ? "true" : "false");
};

const getSidebarState = () => {
  if (!localStorage.getItem("sidebarState")) {
    return true;
  }

  return localStorage.getItem("sidebarState") === "true" ? true : false;
};

const Sidebar: React.FC<SidebarProps> = ({ visible, setVisible }) => {
  const navigate = useNavigate();

  useState(() => {
    setVisible(getSidebarState());
  });

  return (
    <>
      {visible ? (
        <div className="absolute top-0 bottom-0 left-0 w-[300px] h-[100vh] bg-white transition-transform">
          <div className="flex justify-end">
            <img
              src="/brand-logo.png"
              alt=""
              className="size-[170px] m-5 mr-2 self-center"
            />
            <div
              className="cursor-pointer p-[20px] size-fit"
              onClick={() => {
                setVisible(false);
                setSidebarState(false);
              }}
            >
              <IoMenuSharp size={30} />
            </div>
          </div>
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
                  } flex flex-row items-center hover:bg-dark-white cursor-pointer`}
                >
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
                    }`}
                  >
                    {item.name}
                  </h1>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="absolute top-0 bottom-0 left-0 w-[56px] h-[100vh] bg-white transition-transform">
          <div
            onClick={() => {
              setVisible(true);
              setSidebarState(true);
            }}
            className="flex cursor-pointer self-end justify-center py-[20px]"
          >
            <IoMenuSharp size={30} className="" />
          </div>
          <hr className="m-[-2px]" />
          <div className="w-full h-[140px] p-[10px]"></div>
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
                  } flex flex-row items-center hover:bg-dark-white cursor-pointer`}
                >
                  <div className="m-5">
                    <item.icon
                      className={`${
                        window.location.pathname === item.link
                          ? "text-primary"
                          : "text-title"
                      }`}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
