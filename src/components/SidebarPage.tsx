import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface SidebarPage {
  children: React.ReactNode;
  headerTitle: string;
}

const SidebarPage: React.FC<SidebarPage> = ({ children, headerTitle }) => {
  const [visible, setVisible] = useState(true);

  return (
    <>
      <div className="flex flex-col w-full h-full min-h-[100vh]">
        <div className="flex w-full h-[70px] border-b border-border bg-dark-white">
          <Sidebar visible={visible} setVisible={setVisible} />
          <Header visible={visible} headerTitle={headerTitle} />
        </div>

        <div
          className={`${
            visible ? "pl-[340px]" : "pl-[90px]"
          } w-full h-full bg-dark-white `}>
          {children}
        </div>
      </div>
    </>
  );
};

export default SidebarPage;
