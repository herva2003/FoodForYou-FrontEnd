import FlatList from "flatlist-react";
import React, { useState, useEffect, useRef } from "react";
import { data } from "../services/data";

interface DropdownProps {
  onClick: (name: string, id: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ onClick }) => {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const blank = () => (
    <div className="flex justify-center">
      {" "}
      <h1 className="text-sm- text-subtitle">Nenhum item foi encontrado</h1>
    </div>
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-[50%] h-10" ref={dropdownRef}>
      <input
        className="w-[550px] h-full bg-white text-blue-gray-700 
          font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 
          disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 
          placeholder-shown:border-t-blue-gray-200 border focus:border-2 text-sm px-3 py-2.5 rounded-[7px] !pr-9 border-blue-gray-200 focus:border-gray-900"
        onChange={(item) => {
          setVisible(item.target.value.length > 0);
          setText(item.target.value);
        }}
      />
      {visible ? (
        <div className="w-[550px] h-[450px] bg-white overflow-hidden overflow-y-scroll mt-2 shadow-md rounded-lg">
          <FlatList
            list={data}
            renderOnScroll
            renderWhenEmpty={blank}
            filterBy={(item) => item.label.toLowerCase().startsWith(text)}
            renderItem={(item) => (
              <li
                onClick={() => onClick(item.label, item.value)}
                key={item.value}
                className="list-none my-5 hover:bg-dark-white px-5 h-[40px] items-center flex cursor-pointer">
                {item.label}
              </li>
            )}
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Dropdown;