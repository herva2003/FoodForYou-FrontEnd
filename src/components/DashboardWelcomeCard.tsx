import { Card, Modal } from "@mui/material";
import { GiHand } from "react-icons/gi";
import { UserProps } from "../interfaces/UserProps";
import Button from "./Button";
import { useState } from "react";
import Swal from "sweetalert2";
import { useAuth } from "../context/authContext";
import api from "../services/api"
import { AiOutlineClose, AiOutlineMail } from "react-icons/ai";
import Input from "./Input";
import { IoArrowUpOutline, IoPersonOutline } from "react-icons/io5";
import { RiWeightLine } from "react-icons/ri";

export default function DashboardWelcomeCard(props: UserProps) {
    const [fullName, setFullName] = useState(props.fullName); 
    const [email, setEmail] = useState(props.login); 
    const [height, setHeight] = useState(props.height.toString()); 
    const [weight, setWeight] = useState(props.weight.toString()); 
    const [openModal, setOpenModal] = useState(false);
    const [showError, setShowError] = useState(false);
    const { getToken } = useAuth();


    const resetUserFields = () => {
        setFullName(props.fullName);
        setEmail(props.login)
        setHeight(props.height.toString())
        setWeight(props.weight.toString())
    };
    
    const getFormData = (): {} => {
        return {
            fullName: fullName,
            login: email, 
            height: parseFloat(height),
            weight: parseFloat(weight),
        };
    };
    
      const closeModal = () => {
        setOpenModal(false);
        resetUserFields();
      };
    
      const validateRecipe = () => {
        return (
          fullName != "" &&
          email != "" &&
          height.toString() != "" &&
          weight.toString() != ""
        );
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
          console.log(formData)
    
          const response = await api.put("/api/v1/user/", formData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
    
          Swal.close();
    
          if (response.data) {
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

    return (
        <>
            <Modal
                style={{
                alignItems: "center",
                justifyContent: "center",
                alignSelf: "center",
                justifySelf: "center",
                }}
                open={openModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className="min-w-[50vw] min-h-[50vh] bg-white rounded-[4px] py-[20px] px-[40px]">
                <div className="flex justify-between items-center mb-[40px]">
                    <h1 className="text-md text-title font-bold ">
                    Alterar informações de cadastro
                    </h1>
                    <AiOutlineClose
                    size={25}
                    className="cursor-pointer text-title"
                    onClick={closeModal}
                    />
                </div>
                <form onSubmit={submitUpdateUser}>
                    <div className="mb-4">
                        <Input 
                            backgroundColor="bg-dark-white"
                            placeholder="Nome"
                            label="Nome"
                            firstIcon={
                            <IoPersonOutline color="#667085" size={20}></IoPersonOutline>
                            }
                            value={fullName}
                            onChange={(e) => {
                                setFullName(e.target.value)
                            }}
                        ></Input>
                    </div>
                    <div className="mb-4">
                        <Input
                            backgroundColor="bg-dark-white"
                            placeholder="Email"
                            label="Email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value)
                            }}
                            firstIcon={
                                <AiOutlineMail color="#667085" size={20}></AiOutlineMail>
                            }
                        />
                    </div>
                    {/* <div className="mb-4">
                        <Input
                            backgroundColor="bg-dark-white"
                            icon={
                            <button type="button">
                                {showPassword ? (
                                <FiEye
                                onClick={() => setShowPassword((state) => !state)}
                                color="#667085"
                                size={20}
                                />
                                ) : (
                                <FiEyeOff
                                onClick={() => setShowPassword((state) => !state)}
                                color="#667085"
                                size={20}
                                />
                                )}
                            </button>
                            }
                            type={showPassword ? "text" : "password"}
                            placeholder="Senha"
                            label="Senha"
                            // ref={}
                            firstIcon={
                            <IoKeyOutline color="#667085" size={20}></IoKeyOutline>
                            }
                        />
                    </div> */}
                    <div className="flex justify-between">
                        <div className="w-[47%]">
                            <Input
                                backgroundColor="bg-dark-white"
                                placeholder="Altura (cm)"
                                label="Altura"
                                value={height}
                                onChange={(e) => {
                                    setHeight(e.target.value)
                                }}
                                firstIcon={
                                    <IoArrowUpOutline color="#667085" size={20}></IoArrowUpOutline>
                                }
                            />
                        </div>
                        <div className="w-[47%]">
                            <Input
                                backgroundColor="bg-dark-white"
                                placeholder="Peso (kg)"
                                label="Peso"
                                value={weight}
                                onChange={(e) => {
                                    setWeight(e.target.value)
                                }}
                                firstIcon={
                                    <RiWeightLine color="#667085" size={20}></RiWeightLine>
                                }
                            />
                        </div>
                    </div>
                    {showError && (
                    <div className="text-red-600 mb-4">
                        Por favor, preencha todos os campos.
                    </div>
                    )}
                    <div className="flex justify-end items-end mt-[30px] mb-[10px]">
                    <Button title="Alterar dados"/>
                    </div>
                </form>
                </div>
            </Modal>
            <Card variant="outlined" className="w-[97.5%] p-8 mt-9">
                <div className="flex items-center mb-0">
                    <h1 className="font-semibold text-5xl text-title">Olá {props.fullName}!</h1>
                    <GiHand className="text-6xl text-title ml-4"/>
                </div>
                <h2 className="text-3xl text-black/50 font-semibold mb-6">Você está no seu Dashboard.</h2>
                <div className="text-title mb-6">
                    <p className="text-3xl font-semibold mb-2">Seus dados atuais são:</p>
                    <ul className="text-3xl">
                        <li>Email: <span className="font-semibold">{props.login}</span></li>
                        <li>Altura: <span className="font-semibold">{props.height}cm</span></li>
                        <li>Peso atual: <span className="font-semibold">{props.weight}kg</span></li>
                    </ul>
                </div>
                <Button title="Alterar dados" type="button" width="w-1/4" onClick={() => {
                    resetUserFields();
                    setOpenModal(true)
                }}></Button>
            </Card>
        </>
    )
}