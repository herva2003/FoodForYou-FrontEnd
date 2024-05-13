import React, { useEffect, useState } from "react";
import FlatList from "flatlist-react";
import { useIngredients } from "../context/ingredientsContext";
import IngredientCard from "../components/IngredientCard";
import Input from "../components/Input";
import { IoIosCloseCircleOutline } from "react-icons/io";
import SidebarPage from "../components/SidebarPage";
import Button from "../components/Button";
import { Modal } from "@mui/material";
import { AiOutlineCloseCircle } from "react-icons/ai";
import Dropdown from "../components/Dropdown";
import SelectedIngredientCard from "../components/SelectedIngredientCard";
import api from "../services/api";
import { IoSearchOutline } from "react-icons/io5";

interface SelectedIngredientsProps {
  name: string;
  id: string;
}

interface CheckedIngredientsProps {
  id: string;
}

const Ingredients: React.FC = () => {
  const { ingredients } = useIngredients();
  const { handleSetIngredients } = useIngredients();
  const [openModal, setOpenModal] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [visible, setVisible] = useState(false);
  const [checkeds, setCheckeds] = useState<CheckedIngredientsProps[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<
    SelectedIngredientsProps[]
  >([]);

  const getIngredients = async () => {
    try {
      const response = await api.get("/api/user/ingredient");

      if (response.data) {
        handleSetIngredients(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteIngredients = async () => {
    try {
      const response = await api.delete("/api/user/ingredient/", checkeds);

      if (response) {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const submitAddedIngredients = async () => {
    try {
      const response = await api.post(
        "/api/user/ingredient",
        selectedIngredients
      );

      if (response) {
        getIngredients();
        setOpenModal(false);
        setSelectedIngredients([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sortedIngredients: any = ingredients.sort((a, b) =>
    a.descrip.localeCompare(b.descrip)
  );

  const handleRemoveSelectedIngredient = (id: string) => {
    const filter = selectedIngredients.filter((item) => item.id !== id);

    setSelectedIngredients(filter);
  };

  const handleAddSelectedIngredient = (name: string, id: string) => {
    const newItem: SelectedIngredientsProps = {
      name: name,
      id: id,
    };

    setSelectedIngredients((prev) => [...prev, newItem]);
  };

  const blank = () => (
    <div className="flex justify-center">
      {" "}
      <h1 className="text-sm- text-subtitle">A lista está vazia</h1>
    </div>
  );

  const closeModal = () => {
    setOpenModal(false);
  };

  const handleIngredientCheck = (data: { checked: boolean; id: string }) => {
    const { checked, id } = data;

    if (checked === true) {
      setCheckeds((prev) => [...prev, { id: id }]);
    } else {
      setCheckeds((prev) => prev.filter((item) => item.id !== id));
    }
  };

  useEffect(() => {
    setVisible(checkeds.length > 0);
  }, [checkeds]);

  return (
    <>
      <div>
        <Modal
          style={{
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
            justifySelf: "center",
          }}
          open={openModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description">
          <div className="w-[60vw] h-[80vh] bg-white rounded-[4px] py-[20px] px-[40px]">
            <div className="flex justify-between items-center mb-[40px]">
              <h1 className="text-md text-title font-semibold ">
                Selecione os itens que deseja adicionar a sua lista
              </h1>
              <AiOutlineCloseCircle
                size={30}
                className="cursor-pointer text-title"
                onClick={closeModal}
              />
            </div>
            <div className="flex justify-between ">
              <Dropdown onClick={handleAddSelectedIngredient} />
              <div className="flex flex-col h-[60vh] w-[40%] overflow-hidden overflow-y-scroll no-scrollbar rounded-[4px] ">
                <FlatList
                  renderWhenEmpty={blank}
                  list={selectedIngredients}
                  renderOnScroll
                  renderItem={(item, index) => (
                    <div className="mb-5">
                      <SelectedIngredientCard
                        key={index}
                        name={item.name}
                        onClickRemove={() =>
                          handleRemoveSelectedIngredient(item.id)
                        }
                      />
                    </div>
                  )}
                />
              </div>
            </div>
            <div className=" w-full h-[44px] justify-end flex items-end mt-[30px]">
              <Button
                title="Salvar"
                width="w-[10%]"
                onClick={submitAddedIngredients}
              />
            </div>
          </div>
        </Modal>
      </div>
      <SidebarPage headerTitle="Ingredientes">
        <div className="flex flex-col w-full">
          <div className="h-[80vh] flex flex-col w-full pr-[100px] mt-[40px]">
            <Input
              value={filterText}
              onChange={(value) => setFilterText(value.target.value)}
              placeholder="Buscar..."
              firstIcon={<IoSearchOutline color="#667085" size={20} />}
              icon={
                <button onClick={() => setFilterText("")}>
                  <IoIosCloseCircleOutline color="#667085" size={20} />
                </button>
              }
            />
            <div className="flex justify-between items-center mt-[40px]">
              <h1 className="text-md text-subtitle self-end">Sua lista</h1>
              <div className="flex">
                {visible ? (
                  <Button
                    title="Deletar"
                    width="w-[120px]"
                    marginBottom=""
                    backgroundColor="bg-remove"
                    onClick={() => {
                      handleDeleteIngredients();
                      console.log(checkeds, "CHECKEDS");
                    }}
                  />
                ) : (
                  ""
                )}
                <Button
                  title="Adicionar"
                  width="w-[120px]"
                  marginBottom=""
                  marginLeft="ml-[40px]"
                  onClick={() => {
                    setOpenModal(true);
                  }}
                />
              </div>
            </div>
            <div className=" w-full h-[100%] mt-[20px] overflow-y-scroll">
              <FlatList
                list={ingredients}
                renderOnScroll
                sort
                renderWhenEmpty={blank}
                sortBy={sortedIngredients}
                renderItem={(item) => (
                  <IngredientCard
                    handleIngredientCheck={handleIngredientCheck}
                    key={item.id}
                    value={item.descrip}
                    id={item.id}
                  />
                )}
                filterBy={(item) =>
                  item.descrip.toLowerCase().startsWith(filterText)
                }
              />
            </div>
          </div>
        </div>
      </SidebarPage>
    </>
  );
};

export default Ingredients;
