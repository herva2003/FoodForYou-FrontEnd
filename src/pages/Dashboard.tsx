import React, { useEffect, useState } from "react";
import SidebarPage from "../components/SidebarPage";
import DashboardWelcomeCard from "../components/WelcomeCards/DashboardWelcomeCard";
import NutritionalProgressChart from "../components/NutritionalProgressChart";
import api from "../services/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { UserProps } from "../interfaces/UserProps";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Modal, Box } from "@mui/material";
import TutorialDashboard from "../components/Tutorials/TutorialDashboard";
import { useLocation } from "react-router-dom";

const Dashboard: React.FC = () => {
  const [userData, setUserData] = useState<UserProps | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [nutritionalData, setNutritionalData] = useState<any[]>([]);
  const [showWarning, setShowWarning] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedChart, setSelectedChart] = useState<string | null>(null);
  const [modalStartDate, setModalStartDate] = useState<Date | null>(null);
  const [modalEndDate, setModalEndDate] = useState<Date | null>(null);
  const location = useLocation();
  
  useEffect(() => {
    fetchData();
    fetchNutritionalData();
  }, [location]);

  const fetchData = async () => {
    try {
      const response = await api.get("/api/v1/user/me");
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchNutritionalData = async () => {
    try {
      const response = await api.get("/api/v1/user/nv");
      setNutritionalData(response.data.data);
    } catch (error) {
      console.error("Error fetching nutritional data:", error);
    }
  };

  const filterDataByDateRange = (start: Date | null, end: Date | null) => {
    if (!start || !end) return nutritionalData;

    const filteredData = nutritionalData.filter((data) => {
      const dataDate = new Date(data.createdAt);
      return dataDate >= start && dataDate <= end;
    });

    // Ordenar os dados por data
    filteredData.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    return filteredData;
  };

  const downloadPDF = () => {
    if (!startDate || !endDate) {
      setShowWarning(true);
      return;
    }

    setShowWarning(false);
    const filteredData = filterDataByDateRange(startDate, endDate);

    const doc = new jsPDF();

    // Adicionando título do documento
    doc.setFontSize(18);
    doc.text("Relatório Nutricional", 105, 20, { align: "center" });

    // Adicionando linha separadora
    doc.setLineWidth(0.5);
    doc.line(14, 25, 196, 25);

    // Seção de Informações do Paciente
    doc.setFontSize(14);
    doc.text("Informações do Paciente", 14, 35);

    const userInfoTableColumn = ["Campo", "Informação"];
    const userInfoTableRows = [
      ["Nome", userData?.fullName ?? ""],
      ["Altura", `${userData?.height ?? ""} cm`],
      ["Peso", `${userData?.weight ?? ""} kg`],
      ["Dietas", userData?.diets ?? ""],
      ["Alergias", userData?.allergies ?? ""],
      ["Intolerâncias", userData?.intolerances ?? ""],
    ];

    (doc as any).autoTable({
      head: [userInfoTableColumn],
      body: userInfoTableRows,
      startY: 40,
      theme: "grid",
      styles: {
        fontSize: 12,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [22, 160, 133],
        textColor: [255, 255, 255],
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
    });

    // Adicionando linha separadora
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setLineWidth(0.5);
    doc.line(14, finalY, 196, finalY);

    // Adicionando seção da tabela de dados nutricionais
    doc.setFontSize(14);
    doc.text("Dados Nutricionais", 14, finalY + 10);

    const tableColumn = [
      "Data",
      "Calorias (kcal)",
      "Proteína (g)",
      "Gordura (g)",
      "Carboidratos (g)",
      "Açúcar (g)",
      "Sal (mg)",
    ];
    const tableRows: any = [];

    filteredData.forEach((data) => {
      const dataRow = [
        new Date(data.createdAt).toLocaleDateString(),
        data.energy_kcal,
        data.protein_g,
        data.fat_g,
        data.carb_g,
        data.sugar_g,
        data.sodium_mg,
      ];
      tableRows.push(dataRow);
    });

    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: finalY + 20,
      theme: "grid",
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [22, 160, 133],
        textColor: [255, 255, 255],
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
    });

    doc.save("nutritional_report.pdf");
  };

  const handleDropdownChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    const today = new Date();
    let start: Date | null = null;
    let end: Date | null = null;

    if (value === "weekly") {
      start = new Date();
      start.setDate(today.getDate() - 7);
      end = today;
    } else if (value === "monthly") {
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    }

    setStartDate(start);
    setEndDate(end);
  };

  const openModal = (chartType: string) => {
    setSelectedChart(chartType);
    setModalStartDate(startDate);
    setModalEndDate(endDate);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedChart(null);
  };

  return (
    <SidebarPage headerTitle="Dashboard">
      <TutorialDashboard/>
      <div className="h-[100vh] pr-[100px] overflow-y-auto">
        <div id="dashboardWelcomeCard">
          <DashboardWelcomeCard
            login={userData?.login ?? ""}
            fullName={userData?.fullName ?? ""}
            weight={userData?.weight ?? 0}
            height={userData?.height ?? 0}
            diets={userData?.diets ?? ""}
            allergies={userData?.allergies ?? ""}
            intolerances={userData?.intolerances ?? ""}
            fetchData={fetchData}
            id={""}
          />
        </div>

        <div id="charts" className="mt-8 flex flex-col items-center">
          <div className="flex justify-center items-center bg-white shadow-lg rounded-lg mx-64 border p-4">
            <div className="mr-4">
              <DatePicker
                selected={startDate}
                onChange={(date: Date | null) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                isClearable
                placeholderText="Start Date"
                className="border p-2 rounded-lg placeholder-center"
              />
            </div>
            <div className="mr-4">
              <DatePicker
                selected={endDate}
                onChange={(date: Date | null) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                isClearable
                placeholderText="End Date"
                className="border p-2 rounded-lg placeholder-center text-black"
              />
            </div>
            <div className="ml-4">
              <select
                onChange={handleDropdownChange}
                className="border p-2 rounded-lg"
              >
                <option value="">Selecione</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensal</option>
              </select>
            </div>
          </div>
          {showWarning && (
            <p className="text-red-500 mt-2">
              Por favor, selecione o intervalo de datas.
            </p>
          )}
          <button
            onClick={downloadPDF}
            className="mt-4 p-2 bg-blue-500 text-white rounded pdf-button"
          >
            Baixar PDF
          </button>
          <div className="mt-[50px] w-full shadow-lg rounded-lg p-2 flex flex-col gap-4 justify-center mb-64">
            <div className="flex flex-wrap gap-8 justify-center">
              {["line", "bar", "pie", "doughnut", "radar", "polarArea"].map(
                (chartType) => (
                  <button
                    key={chartType}
                    className="bg-white shadow-lg rounded-lg p-4 mb-16 cursor-pointer chart-button"
                    style={{ width: "30%", minHeight: "100px" }}
                    onClick={() => openModal(chartType)}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && openModal(chartType)}
                  >
                    <NutritionalProgressChart
                      chartType={chartType}
                      startDate={startDate}
                      endDate={endDate}
                    />
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal open={modalIsOpen} onClose={closeModal}>
        <Box
          sx={{
            position: "relative",
            width: "80%",
            height: "80%",
            margin: "auto",
            marginTop: "5%",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {selectedChart && (
            <div className="flex flex-col items-center h-full w-full">
              <div className="flex justify-center items-center mb-4">
                <div className="mr-4">
                  <DatePicker
                    selected={modalStartDate}
                    onChange={(date: Date | null) => setModalStartDate(date)}
                    selectsStart
                    startDate={modalStartDate}
                    endDate={modalEndDate}
                    isClearable
                    placeholderText="Start Date"
                    className="border p-2 rounded-lg placeholder-center text-sm w-32 h-8"
                  />
                </div>
                <div className="mr-4">
                  <DatePicker
                    selected={modalEndDate}
                    onChange={(date: Date | null) => setModalEndDate(date)}
                    selectsEnd
                    startDate={modalStartDate}
                    endDate={modalEndDate}
                    minDate={modalStartDate}
                    isClearable
                    placeholderText="End Date"
                    className="border p-2 rounded-lg placeholder-center text-sm w-32 h-8 text-black"
                  />
                </div>
              </div>
              <div
                className="bg-white shadow-lg rounded-lg p-4 flex-grow flex items-center justify-center"
                style={{
                  width: "100%",
                  height: "calc(100% - 48px)",
                  overflow: "auto",
                }}
              >
                <NutritionalProgressChart
                  chartType={selectedChart as any}
                  startDate={modalStartDate}
                  endDate={modalEndDate}
                />
              </div>
            </div>
          )}
        </Box>
      </Modal>
    </SidebarPage>
  );
};

export default Dashboard;
