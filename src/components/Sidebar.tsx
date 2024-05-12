import React, { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { SidebarData } from "../../global";
import { useNavigate } from "react-router-dom";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);

  return (
    <>
      {visible ? (
        <>
          <div className="flex-shrink-0 w-[300px] h-[100vh] bg-white relative z-10">
            <div
              onClick={() => setVisible(false)}
              className="w-[30px] h-[30px] bg-white rounded-full flex items-center justify-center shadow-md absolute top-10 right-[-15px] cursor-pointer">
              <IoIosArrowBack />
            </div>
            <div className="w-full h-[150px] border-b border-dar-grey p-[10px]"></div>
            <div className="w-full h-full justify-center">
              <ul className="">
                {SidebarData.map((item) => (
                  <li
                    onClick={() => navigate(item.link)}
                    key={item.name}
                    className="text-white flex flex-row items-center hover:bg-secondary-darker cursor-pointer">
                    <div className="m-5">
                      <item.icon className="text-dark-grey" />
                    </div>
                    <h1 className="text-dark-grey">
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
          className="w-[30px] h-[30px] bg-white rounded-full shadow-md flex items-center justify-center absolute top-10 left-10 cursor-pointer">
          <IoIosArrowForward />
        </div>
      )}
    </>
  );
};

export default Sidebar;
