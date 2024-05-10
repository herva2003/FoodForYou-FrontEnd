import FlatList from "flatlist-react";
import React, { useRef, useState } from "react";
import { data } from "../services/data";

const Dropdown: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState("");
  let onChangeDelayRef = useRef<number | null>(null);
  console.log("renderizou");

  return (
    <div className="w-[50%] h-10">
      <input
        className="w-full h-full bg-white text-blue-gray-700 
    font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 
    disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 
    placeholder-shown:border-t-blue-gray-200 border focus:border-2 text-sm px-3 py-2.5 rounded-[7px] !pr-9 border-blue-gray-200 focus:border-gray-900"
        onChange={(item) => {
          setVisible(item.target.value.length > 0);

          if (onChangeDelayRef.current) {
            clearTimeout(onChangeDelayRef.current);
          }
          //   onChangeDelayRef.current = setTimeout(() => {
          setText(item.target.value);
          // }, 300);
        }}
      />
      {visible ? (
        <div className="w-full h-[500px] bg-white overflow-hidden overflow-y-scroll mt-2 p-10 shadow-md rounded-lg">
          <FlatList
            list={data}
            renderOnScroll
            filterBy={(item) => item.label.toLowerCase().startsWith(text)}
            renderItem={(item) => (
              <li key={item.value} className="list-none my-5">
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
