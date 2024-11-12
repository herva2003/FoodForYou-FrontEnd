import React, { useEffect, useState } from "react";
import SidebarPage from "../components/SidebarPage";
import DashboardWelcomeCard from "../components/DashboardWelcomeCard";
import NutritionalProgressChart from "../components/NutritionalProgressChart";
import api from "../services/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { UserProps } from "../interfaces/UserProps";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Modal, Box } from "@mui/material";

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

  const fetchData = async () => {
    try {
      const response = await api.get("/api/v1/user/me");
      const userDataFromApi: UserProps = response.data;
      setUserData(userDataFromApi);
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

  useEffect(() => {
    fetchData();
    fetchNutritionalData();
  }, []);

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
    doc.text("Relatório Nutricional", 14, 22);

    // Define the table columns
    const tableColumn = [
      "Data",
      "Calorias (kcal)",
      "Proteína (g)",
      "Gordura (g)",
      "Carboidratos (g)",
      "Açúcar (g)",
      "Sal (mg)",
    ];
    // Define the table rows
    const tableRows: any[] = [];

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

    // Add table to PDF
    (doc as any).autoTable(tableColumn, tableRows, { startY: 30 });

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
      <div className="h-[100vh] pr-[100px] overflow-y-auto">
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
        <div className="mt-8 flex flex-col items-center">
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
            className="mt-4 p-2 bg-blue-500 text-white rounded"
          >
            Baixar PDF
          </button>
          <div
            id="pdf-content"
            className="mt-[50px] w-full shadow-lg rounded-lg p-2 flex flex-col gap-4 justify-center mb-64"
          >
            <div className="flex flex-wrap gap-8 justify-center">
              <button
                className="bg-white shadow-lg rounded-lg p-4 mb-16 cursor-pointer"
                style={{ width: "30%", minHeight: "100px" }}
                onClick={() => openModal("line")}
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && openModal("line")}
              >
                <NutritionalProgressChart
                  chartType="line"
                  startDate={startDate}
                  endDate={endDate}
                />
              </button>
              <button
                className="bg-white shadow-lg rounded-lg p-4 mb-16 cursor-pointer"
                style={{ width: "30%", minHeight: "300px" }}
                onClick={() => openModal("bar")}
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && openModal("bar")}
              >
                <NutritionalProgressChart
                  chartType="bar"
                  startDate={startDate}
                  endDate={endDate}
                />
              </button>
              <button
                className="bg-white shadow-lg rounded-lg p-4 mb-16 cursor-pointer"
                style={{ width: "30%", minHeight: "300px" }}
                onClick={() => openModal("pie")}
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && openModal("pie")}
              >
                <NutritionalProgressChart
                  chartType="pie"
                  startDate={startDate}
                  endDate={endDate}
                />
              </button>
              <button
                className="bg-white shadow-lg rounded-lg p-4 mb-16 cursor-pointer"
                style={{ width: "30%", minHeight: "300px" }}
                onClick={() => openModal("doughnut")}
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && openModal("doughnut")}
              >
                <NutritionalProgressChart
                  chartType="doughnut"
                  startDate={startDate}
                  endDate={endDate}
                />
              </button>
              <button
                className="bg-white shadow-lg rounded-lg p-4 mb-16 cursor-pointer"
                style={{ width: "30%", minHeight: "300px" }}
                onClick={() => openModal("radar")}
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && openModal("radar")}
              >
                <NutritionalProgressChart
                  chartType="radar"
                  startDate={startDate}
                  endDate={endDate}
                />
              </button>
              <button
                className="bg-white shadow-lg rounded-lg p-4 mb-16 cursor-pointer"
                style={{ width: "30%", minHeight: "300px" }}
                onClick={() => openModal("polarArea")}
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && openModal("polarArea")}
              >
                <NutritionalProgressChart
                  chartType="polarArea"
                  startDate={startDate}
                  endDate={endDate}
                />
              </button>
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
