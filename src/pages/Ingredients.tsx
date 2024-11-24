import React, { useEffect, useState } from "react";
import FlatList from "flatlist-react";
import { useIngredients } from "../context/ingredientsContext";
import IngredientCard from "../components/Cards/IngredientCard";
import Input from "../components/Input";
import SidebarPage from "../components/SidebarPage";
import Button from "../components/Button";
import { Modal, Tabs, Tab } from "@mui/material";
import { AiOutlineClose } from "react-icons/ai";
import Dropdown from "../components/Dropdown";
import SelectedIngredientCard from "../components/Cards/SelectedIngredientCard";
import api from "../services/api";
import { IoSearchOutline } from "react-icons/io5";
import { useAuth } from "../context/authContext";
import { IoMdHelpCircle, IoIosCloseCircleOutline } from "react-icons/io";
import Swal from "sweetalert2";
import IngredientsWelcomeCard from "../components/WelcomeCards/IngredientsWelcomeCard";
import ShoppingListWelcomeCard from "../components/WelcomeCards/ShoppingListWelcomeCard";
import ingredientData from "../../ingredientes.json";
import TutorialIngredients from "../components/Tutorials/TutorialIngredients";
import IntroJs from "intro.js";
import "intro.js/introjs.css";
import SearchBar from "../components/SearchBar";

interface SelectedIngredientsProps {
  name: string;
  ingredientId: string;
  quantity: string;
}

interface CheckedIngredientsProps {
  ingredientId: string;
  quantity?: string;
}

interface IngredientDetail {
  id: string;
  descrip: string;
  quantity: string;
}

const Ingredients: React.FC = () => {
  const { ingredients, handleSetIngredients } = useIngredients();
  const [openModal, setOpenModal] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [visible, setVisible] = useState(false);
  const [checkeds, setCheckeds] = useState<CheckedIngredientsProps[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<
    SelectedIngredientsProps[]
  >([]);
  const [tabIndex, setTabIndex] = useState(0);
  const { getToken } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (tabIndex === 0) {
      getIngredients();
    } else {
      getShoppingList();
    }
    setVisible(checkeds.length > 0);
  }, [checkeds, tabIndex, searchQuery]);

  const addIngredients = async (): Promise<void> => {
    try {
      const token = await getToken();
      const ingredientsToAdd = selectedIngredients.map((ingredient) => ({
        id: ingredient.ingredientId,
        name: ingredient.name,
        quantity: ingredient.quantity,
      }));

      const response = await api.post(
        "/api/v1/user/ingredient",
        ingredientsToAdd,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response) {
        console.log("addIngredients response:", response);
        getIngredients();
        setOpenModal(false);
        setSelectedIngredients([]);
        Swal.fire({
          title: "Sucesso!",
          text: "Ingredientes adicionados com sucesso.",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.log("addIngredients error:", error);
      Swal.fire({
        title: "Erro!",
        text: "Ocorreu um erro ao adicionar os ingredientes.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const getIngredients = async (): Promise<void> => {
    try {
      const token = await getToken();
      const response = await api.get("/api/v1/user/ingredient", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        console.log("getIngredients response:", response.data);

        const ingredientsWithDetails = response.data.data.map(
          (item: { ingredientId: string; quantity: string }) => {
            const ingredientDetail = ingredientData.find(
              (ingredient) => ingredient.oid === item.ingredientId
            );
            return {
              ...ingredientDetail,
              id: item.ingredientId,
              quantity: item.quantity,
            };
          }
        );

        console.log("Mapped ingredients with details:", ingredientsWithDetails);
        handleSetIngredients(ingredientsWithDetails);
      }
    } catch (error) {
      console.log("getIngredients error:", error);
    }
  };

  const deleteIngredients = async (): Promise<void> => {
    try {
      const token = await getToken();
      const ingredientIds = checkeds.map((item) => item.ingredientId);
      const response = await api.delete("/api/v1/user/ingredient", {
        data: ingredientIds,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response) {
        console.log("deleteIngredients response:", response);
        setCheckeds([]);
        Swal.fire({
          title: "Deletado!",
          text: "Seus ingredientes foram deletados com sucesso.",
          icon: "success",
        });
      }
    } catch (error) {
      console.log("deleteIngredients error:", error);
      Swal.fire({
        title: "Erro!",
        text: "Ocorreu um erro ao deletar os ingredientes.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const addShoppingList = async (): Promise<void> => {
    try {
      const token = await getToken();
      const shoppingListToAdd = selectedIngredients.map((ingredient) => ({
        id: ingredient.ingredientId,
        name: ingredient.name,
        quantity: ingredient.quantity,
      }));

      const response = await api.post(
        "/api/v1/user/shoppList",
        shoppingListToAdd,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response) {
        console.log("addShoppingList response:", response);
        getShoppingList();
        setOpenModal(false);
        setSelectedIngredients([]);
        Swal.fire({
          title: "Sucesso!",
          text: "Ingredientes adicionados com sucesso.",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.log("addShoppingList error:", error);
      Swal.fire({
        title: "Erro!",
        text: "Ocorreu um erro ao adicionar os ingredientes.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const getShoppingList = async (): Promise<void> => {
    try {
      const token = await getToken();
      const response = await api.get("/api/v1/user/shoppList", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        console.log("getShoppingList response:", response.data);

        const ingredientsWithDetails = response.data.data.map(
          (item: { ingredientId: string; quantity: string }) => {
            const ingredientDetail = ingredientData.find(
              (ingredient) => ingredient.oid === item.ingredientId
            );
            return {
              ...ingredientDetail,
              id: item.ingredientId,
              quantity: item.quantity,
            };
          }
        );

        console.log("Mapped shoppList with details:", ingredientsWithDetails);
        handleSetIngredients(ingredientsWithDetails);
      }
    } catch (error) {
      console.log("getShoppingList error:", error);
    }
  };

  const deleteShoppingList = async (): Promise<void> => {
    try {
      const token = await getToken();
      const response = await api.delete("/api/v1/user/shoppList", {
        data: checkeds,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response) {
        console.log("deleteShoppingList response:", response);
        setCheckeds([]);
        Swal.fire({
          title: "Deletado!",
          text: "Seus ingredientes foram deletados com sucesso.",
          icon: "success",
        });
      }
    } catch (error) {
      console.log("deleteShoppingList error:", error);
      Swal.fire({
        title: "Erro!",
        text: "Ocorreu um erro ao deletar os ingredientes.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleConfirmDelete = (): void => {
    Swal.fire({
      title: "Você tem certeza?",
      text: "Esta ação não pode ser revertida!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, deletar!",
    }).then((result) => {
      if (result.isConfirmed) {
        if (tabIndex === 0) {
          deleteIngredients();
        } else {
          deleteShoppingList();
        }
      }
    });
  };

  const filteredIngredients = ingredients
    ? ingredients
        .filter((ingredient: IngredientDetail) => ingredient.descrip)
        .sort((a: IngredientDetail, b: IngredientDetail) =>
          a.descrip.localeCompare(b.descrip)
        )
    : [];

  const handleRemoveSelectedIngredient = (id: string): void => {
    const filter = selectedIngredients.filter(
      (item) => item.ingredientId !== id
    );
    setSelectedIngredients(filter);
  };

  const handleQtdChange = (id: string, value: string): void => {
    setSelectedIngredients((prev) =>
      prev.map((ingredient) =>
        ingredient.ingredientId === id
          ? { ...ingredient, quantity: value }
          : ingredient
      )
    );
  };

  const handleAddSelectedIngredient = (name: string, id: string): void => {
    const isAlreadyAdded = selectedIngredients.some(
      (item) => item.ingredientId === id
    );
    if (!isAlreadyAdded) {
      const newItem: SelectedIngredientsProps = {
        name: name,
        ingredientId: id,
        quantity: "",
      };
      setSelectedIngredients((prev) => [...prev, newItem]);
    }
  };

  const blank = (): JSX.Element => (
    <div className="flex justify-center">
      {" "}
      <h1 className="text-sm- text-subtitle">A lista está vazia</h1>
    </div>
  );

  const closeModal = (): void => {
    setOpenModal(false);
  };

  const handleIngredientCheck = (data: {
    checked: boolean;
    id: string;
    quantity?: string;
  }): void => {
    const { checked, id, quantity } = data;

    if (checked) {
      setCheckeds((prev) => [
        ...prev,
        { ingredientId: id, quantity: quantity || "0" },
      ]);
    } else {
      setCheckeds((prev) => prev.filter((item) => item.ingredientId !== id));
    }
  };

  const handleMoveIngredient = async (): Promise<void> => {
    try {
      const token = await getToken();
      const response = await api.post(
        `/api/v1/user/moveIngredients`,
        checkeds,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("moveIngredients response:", response);
      getIngredients();
      getShoppingList();
      setCheckeds([]);
      Swal.fire({
        title: "Sucesso!",
        text: "Ingredientes movidos com sucesso.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error moving ingredients:", error);
      Swal.fire({
        title: "Erro!",
        text: "Ocorreu um erro ao mover os ingredientes.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const tabs = [
    { index: 0, label: "Lista de Ingredientes" },
    { index: 1, label: "Lista de Compras" },
  ];

  const startTutorial = () => {
    console.log("startTutorial");
    IntroJs()
      .setOptions({
        steps: [
          {
            title: "Adicione um ingrediente",
            element: "#addItem",
            intro: "Digite o ingrediente que voce possui em casa.",
          },
          {
            title: "Adicione uma quantidade ao ingrediente",
            element: "#addQtd",
            intro:
              "Digite a quantidade de ingrediente que voce possui em casa.",
          },
          {
            title: "Clique aqui para salvar",
            element: "#salvarIng",
            intro:
              "Clicando aqui voce salvará seus ingredientes em seu perfil.",
          },
        ],
        showProgress: true,
        showBullets: false,
        scrollTo: "tooltip",
        scrollToElement: true,
        scrollPadding: 300,
        exitOnOverlayClick: false,
        disableInteraction: true,
        exitOnEsc: false,
      })
      .start();
  };

  return (
    <>
      <div>
        <Modal
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          open={openModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <div className="w-[50vw] h-[60vh] bg-white rounded-[4px] py-[20px] px-[40px] flex flex-col overflow-auto">
            <div className="flex justify-between items-center mb-[40px]">
              <h1 className="text-md text-title font-semibold">
                Selecione os itens que deseja adicionar à sua lista
              </h1>
              <div className="flex items-center">
                <IoMdHelpCircle
                  size={25}
                  className="cursor-pointer text-title mr-3"
                  onClick={startTutorial}
                />
                <AiOutlineClose
                  size={30}
                  className="cursor-pointer text-title"
                  onClick={closeModal}
                />
              </div>
            </div>
            <div className="flex justify-between flex-grow">
              <div id="addItem" className="w-[22vw] h-[4vh]">
                <Dropdown onClick={handleAddSelectedIngredient} />
              </div>
              <div className="flex flex-col h-full w-[40%] overflow-hidden overflow-y-scroll no-scrollbar rounded-[4px]">
                <FlatList
                  renderWhenEmpty={blank}
                  list={selectedIngredients}
                  renderOnScroll
                  renderItem={(item, index) => (
                    <div className="mb-5" id="addQtd" key={index}>
                      <SelectedIngredientCard
                        name={item.name}
                        quantity={item.quantity}
                        onQtdChange={(value) =>
                          handleQtdChange(item.ingredientId, value)
                        }
                        onClickRemove={() =>
                          handleRemoveSelectedIngredient(item.ingredientId)
                        }
                      />
                    </div>
                  )}
                />
              </div>
            </div>
            <div className=" flex justify-end">
              <div id="salvarIng" className="w-[4vw] h-[4vh]">
                <Button
                  title="Salvar"
                  onClick={tabIndex === 0 ? addIngredients : addShoppingList}
                />
              </div>
            </div>
          </div>
        </Modal>
      </div>
      <SidebarPage headerTitle={tabs[tabIndex].label}>
        <TutorialIngredients />
        <div className="flex flex-col w-full h-[100vh] pr-[100px]">
          <Tabs
            value={tabIndex}
            onChange={(event: React.ChangeEvent<{}>, newValue: number) =>
              setTabIndex(newValue)
            }
            aria-label="Ingredients and Shopping List Tabs"
            id="tabs"
            className="mr-24"
          >
            {tabs.map((tab) => (
              <Tab key={tab.index} label={tab.label} />
            ))}
          </Tabs>
          <div className="mt-4">
            {tabIndex === 0 ? (
              <IngredientsWelcomeCard />
            ) : (
              <ShoppingListWelcomeCard />
            )}
          </div>
          <div className="flex flex-col overflow-y-auto mb-12">
            <div className="search mt-6">
              <div id="search" className="mt-6">
                <SearchBar filterText={searchQuery} setFilterText={setSearchQuery} />
              </div>
            </div>
            <div className="flex justify-between items-center mt-[40px]">
              <h1 className="text-md text-subtitle self-end">
                {tabIndex === 0 ? "Sua lista" : "Sua lista de compras"}
              </h1>
              <div className="flex">
                {visible && (
                  <>
                    <Button
                      title="Remover"
                      width="w-[120px]"
                      marginBottom=""
                      backgroundColor="bg-remove"
                      onClick={() => {
                        handleConfirmDelete();
                        console.log(checkeds, "CHECKEDS");
                      }}
                    />
                    {tabIndex === 1 && (
                      <Button
                        title="Comprado"
                        width="w-[120px]"
                        marginBottom=""
                        backgroundColor="bg-green-500"
                        onClick={() => {
                          handleMoveIngredient();
                          console.log(checkeds, "CHECKEDS");
                        }}
                      />
                    )}
                  </>
                )}
                <div id="add-button">
                  <Button
                    title="Adicionar"
                    width="w-[120px]"
                    marginBottom=""
                    onClick={() => {
                      setOpenModal(true);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="w-full h-[100%] mt-[20px] IngredientCard overflow-y-auto mb-12">
              <FlatList
                list={filteredIngredients}
                renderWhenEmpty={() => (
                  <div className="flex justify-center">
                    <h1 className="text-sm- text-subtitle">
                      A lista está vazia
                    </h1>
                  </div>
                )}
                renderItem={(item) => (
                  <IngredientCard
                    handleIngredientCheck={handleIngredientCheck}
                    key={item.id}
                    value={item.descrip}
                    id={item.id}
                    quantity={item.quantity}
                    handleMoveIngredient={handleMoveIngredient}
                  />
                )}
              />
            </div>
          </div>
        </div>
      </SidebarPage>
    </>
  );
};

export default Ingredients;
