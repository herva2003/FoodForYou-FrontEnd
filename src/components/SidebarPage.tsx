import React, { useEffect, useRef, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useAuth } from "../context/authContext";
import api from "../services/api";
import { UserProps } from "../interfaces/UserProps";
import { Link, useNavigate } from "react-router-dom";

interface SidebarPage {
  children: React.ReactNode;
  headerTitle: string;
}

const SidebarPage: React.FC<SidebarPage> = ({ children, headerTitle }) => {
  const [userData, setUserData] = useState<UserProps | null>(null);
  const [visible, setVisible] = useState(true);
  const [profileVisible, setProfileVisible] = useState(false);
  const navigate = useNavigate();
  const { handleSetToken, getRefreshToken, getToken } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchData = async () => {
    try {
      const response = await api.get("/api/v1/user/me");
      const userDataFromApi: UserProps = response.data;
      setUserData(userDataFromApi);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const logout = async () => {
    try {
      const accessToken = await getToken();
      const refreshToken = await getRefreshToken();

      const response = await api.post("/api/v1/auth/logout", {
        accessToken,
        refreshToken,
      });

      if (response.status === 200) {
        handleSetToken("", "");
        localStorage.removeItem("refreshToken");
        navigate("/login");
      } else {
        alert("Erro ao fazer logout");
      }
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      alert("Erro ao fazer logout. Por favor, tente novamente mais tarde.");
    }
  };

  const toggleProfile = () => {
    setProfileVisible(!profileVisible);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setProfileVisible(false);
    }
  };

  useEffect(() => {
    if (profileVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileVisible]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

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
          } w-full h-full bg-dark-white`}
        >
          {children}
        </div>
      </div>
      <div className="absolute top-2 right-5">
        {userData && (
          <button
            className="bg-gray-500 text-white font-bold flex items-center justify-center rounded-full w-10 h-10 cursor-pointer"
            onClick={toggleProfile}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                toggleProfile();
              }
            }}
          >
            {getInitials(userData.fullName)}
          </button>
        )}
        {profileVisible && (
          <div
            ref={dropdownRef}
            className="absolute top-12 right-0 bg-white border border-gray-300 rounded-lg p-6 shadow-lg w-96 h-128"
          >
            <div className="absolute top-0 left-0 mt-2 mr-2 p-3">
              <p className="font-bold text-lg">{"Food For You"}</p>
            </div>
            <button
              className="text-black transition-colors duration-100 hover:bg-gray-400 hover:text-black absolute top-0 right-0 mt-2 mr-2 p-3"
              onClick={logout}
            >
              Sair
            </button>
            <div className="flex items-center mb-4 mt-8">
              <div className="bg-gray-500 text-white font-bold flex items-center justify-center rounded-full w-28 h-28 mr-5 text-5xl">
                {getInitials(userData?.fullName ?? "")}
              </div>
              <div className="mb-16 mt-8">
                <p className="font-bold text-lg">{userData?.fullName ?? ""}</p>
                <p className="text-sm text-gray-600">{userData?.login ?? ""}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SidebarPage;
