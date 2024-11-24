import { Modal } from "@mui/material";
import { UserProps } from "../../interfaces/UserProps";
import Button from "../Button";
import { useState } from "react";
import Swal from "sweetalert2";
import { useAuth } from "../../context/authContext";
import api from "../../services/api";
import { AiOutlineClose } from "react-icons/ai";
import { IoMdHelpCircle } from "react-icons/io";
import Input from "../Input";
import { IoArrowUpOutline, IoPersonOutline } from "react-icons/io5";
import { RiWeightLine } from "react-icons/ri";
import IntroJs from "intro.js";
import "intro.js/introjs.css";

interface DashboardWelcomeCardProps extends UserProps {
  fetchData: () => void;
}

export default function DashboardWelcomeCard(props: DashboardWelcomeCardProps) {
  const [fullName, setFullName] = useState(props.fullName);
  const [height, setHeight] = useState(props.height.toString());
  const [weight, setWeight] = useState(props.weight.toString());
  const [diets, setDiets] = useState(props.diets.toString());
  const [allergies, setAllergies] = useState(props.allergies.toString());
  const [intolerances, setIntolerances] = useState(
    props.intolerances.toString()
  );
  const [openModal, setOpenModal] = useState(false);
  const [showError, setShowError] = useState(false);
  const { getToken } = useAuth();

  const resetUserFields = () => {
    setFullName(props.fullName);
    setHeight(props.height.toString());
    setWeight(props.weight.toString());
    setDiets(props.diets.toString());
    setAllergies(props.allergies.toString());
    setIntolerances(props.intolerances.toString());
  };

  const getFormData = (): {} => {
    return {
      fullName: fullName,
      height: parseFloat(height),
      weight: parseFloat(weight),
      diets: diets.split(","),
      allergies: allergies.split(","),
      intolerances: intolerances.split(","),
    };
  };

  const closeModal = () => {
    setOpenModal(false);
    resetUserFields();
  };

  const validateRecipe = () => {
    return fullName != "" && height.toString() != "" && weight.toString() != "";
  };

  const submitUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRecipe()) {
      setShowError(true);
      return;
    }
    Swal.fire({
      title: "Loading",
      html: "Loading",
      timer: 2000,
      timerProgressBar: true,
    });

    try {
      const token = await getToken();
      const formData = getFormData();
      console.log(formData);
      const response = await api.put("/api/v1/user/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.close();

      if (response.data) {
        props.fetchData();
        closeModal();
        Swal.fire({
          title: "Success!",
          text: "Recipe added successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error sending data:", error);
      closeModal();
      Swal.close();
      Swal.fire({
        title: "Error!",
        text: "An error occurred while adding the recipe.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const startTutorial = () => {
    setTimeout(() => {
      IntroJs().setOptions({
        steps: [
          { title: "Alterar Informações", intro: "Vamos ver como alterar suas informações." },
          { title: "Nome", element: "#name", intro: "Aqui você pode alterar seu nome." },
          { title: "Altura", element: "#height", intro: "Aqui você pode alterar sua altura." },
          { title: "Peso", element: "#weight", intro: "Aqui você pode alterar seu peso." },
          { title: "Dietas", element: "#diets", intro: "Aqui você pode adicionar dietas." },
          { title: "Alergias", element: "#allergies", intro: "Aqui você pode adicionar alergias." },
          { title: "Intolerâncias", element: "#intolerances", intro: "Aqui você pode adicionar intolerâncias." },
        ],
        showProgress: true,
        showBullets: false,
        scrollTo: "tooltip",
        scrollToElement: true,
        scrollPadding: 300,
        exitOnOverlayClick: false,
        disableInteraction: true,
        exitOnEsc: false,
      }).start();
    }, 200);
  };
  
  return (
    <>
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
        <div className="max-w-[50vw] bg-white rounded-[25px] py-[20px] px-[40px]">
          <div className="flex justify-between items-center mb-[40px]">
            <h1 className="text-md text-title font-bold">
              Alterar informações de cadastro
            </h1>
            <div className="flex items-center">
              <IoMdHelpCircle
                size={25}
                className="cursor-pointer text-title mr-3"
                onClick={startTutorial}
              />
              <AiOutlineClose
                size={25}
                className="cursor-pointer text-title"
                onClick={closeModal}
              />
            </div>
          </div>
          <form onSubmit={submitUpdateUser}>
            <div className="mb-4">
              <Input
                id="name"
                backgroundColor="bg-dark-white"
                placeholder="Nome"
                label="Nome"
                firstIcon={<IoPersonOutline color="#667085" size={20} />}
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                }}
              />
            </div>
            <div className="flex justify-between">
              <div className="w-[47%]">
                <Input
                  id="height"
                  backgroundColor="bg-dark-white"
                  placeholder="Altura (cm)"
                  label="Altura"
                  value={height}
                  onChange={(e) => {
                    setHeight(e.target.value);
                  }}
                  firstIcon={<IoArrowUpOutline color="#667085" size={20} />}
                />
              </div>
              <div className="w-[47%]">
                <Input
                  id="weight"
                  backgroundColor="bg-dark-white"
                  placeholder="Peso (kg)"
                  label="Peso"
                  value={weight}
                  onChange={(e) => {
                    setWeight(e.target.value);
                  }}
                  firstIcon={<RiWeightLine color="#667085" size={20} />}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <div className="w-[30%]">
                <Input
                  id="diets"
                  backgroundColor="bg-dark-white"
                  placeholder="Dietas"
                  label="Dietas"
                  value={diets}
                  onChange={(e) => {
                    setDiets(e.target.value);
                  }}
                />
              </div>
              <div className="w-[30%]">
                <Input
                  id="allergies"
                  backgroundColor="bg-dark-white"
                  placeholder="Alergias"
                  label="Alergias"
                  value={allergies}
                  onChange={(e) => {
                    setAllergies(e.target.value);
                  }}
                />
              </div>
              <div className="w-[30%]">
                <Input
                  id="intolerances"
                  backgroundColor="bg-dark-white"
                  placeholder="Intolerâncias"
                  label="Intolerâncias"
                  value={intolerances}
                  onChange={(e) => {
                    setIntolerances(e.target.value);
                  }}
                />
              </div>
            </div>
            {showError && (
              <div className="text-red-600 mb-4">
                Por favor, preencha todos os campos.
              </div>
            )}
            <div className="flex justify-end mt-[30px] mb-[10px]">
              <Button title="Alterar dados" />
            </div>
          </form>
        </div>
      </Modal>
      <div className="w-[90%] p-12 mt-9 ml-16 bg-white shadow-lg rounded-lg">
        <div className="flex items-center mb-0">
          <h1 className="font-semibold text-3xl text-title">
            Olá {props.fullName}!
          </h1>
        </div>
        <div className="text-title mb-6 mt-4">
          <ul className="text-1xl">
            <li>
              <span className="font-semibold">Altura</span>: {props.height}cm
            </li>
            <li>
              <span className="font-semibold">Peso atual</span>: {props.weight}
              kg
            </li>
            <li>
              <span className="font-semibold">Dietas</span>: {props.diets}
            </li>
            <li>
              <span className="font-semibold">Alergias</span>: {props.allergies}
            </li>
            <li>
              <span className="font-semibold">intolerâncias</span>:{" "}
              {props.intolerances}
            </li>
          </ul>
        </div>
        <Button
          title="Alterar dados"
          type="button"
          width="w-1/4"
          onClick={() => {
            resetUserFields();
            setOpenModal(true);
          }}
        />
      </div>
    </>
  );
}
