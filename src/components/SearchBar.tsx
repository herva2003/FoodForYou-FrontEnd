import React from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import Input from "./Input";

interface SearchBarProps {
  filterText: string;
  setFilterText: React.Dispatch<React.SetStateAction<string>>;
}

const SearchBar: React.FC<SearchBarProps> = ({ filterText, setFilterText }) => {
  return (
    <div className="mb-4">
      <Input
        value={filterText}
        onChange={(event) => setFilterText(event.target.value)}
        placeholder="Buscar..."
        firstIcon={<IoSearchOutline color="#667085" size={20} />}
        icon={
          <button onClick={() => setFilterText("")}>
            <IoIosCloseCircleOutline color="#667085" size={20} />
          </button>
        }
      />
    </div>
  );
};

export default SearchBar;