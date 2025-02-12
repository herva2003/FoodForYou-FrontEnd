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
import { Modal, Box, Button, FormControlLabel, Checkbox } from "@mui/material";
import TutorialDashboard from "../components/Tutorials/TutorialDashboard";
import { useLocation } from "react-router-dom";

const availableColumns = [
  "energy_kcal",
  "protein_g",
  "saturated_fats_g",
  "fat_g",
  "carb_g",
  "fiber_g",
  "sugar_g",
  "calcium_mg",
  "iron_mg",
  "magnesium_mg",
  "phosphorus_mg",
  "potassium_mg",
  "sodium_mg",
  "zinc_mg",
  "copper_mcg",
  "manganese_mg",
  "selenium_mcg",
  "vitC_mg",
  "thiamin_mg",
  "riboflavin_mg",
  "niacin_mg",
  "vitB6_mg",
  "folate_mcg",
  "vitB12_mcg",
  "vitA_mcg",
  "vitE_mg",
  "vitD2_mcg",
];

const columnLabels: { [key: string]: string } = {
  energy_kcal: "Calorias (kcal)",
  protein_g: "Proteína (g)",
  saturated_fats_g: "Gordura Saturada (g)",
  fat_g: "Gordura (g)",
  carb_g: "Carboidratos (g)",
  fiber_g: "Fibra (g)",
  sugar_g: "Açúcar (g)",
  calcium_mg: "Cálcio (mg)",
  iron_mg: "Ferro (mg)",
  magnesium_mg: "Magnésio (mg)",
  phosphorus_mg: "Fósforo (mg)",
  potassium_mg: "Potássio (mg)",
  sodium_mg: "Sódio (mg)",
  zinc_mg: "Zinco (mg)",
  copper_mcg: "Cobre (mcg)",
  manganese_mg: "Manganês (mg)",
  selenium_mcg: "Selênio (mcg)",
  vitC_mg: "Vitamina C (mg)",
  thiamin_mg: "Tiamina (mg)",
  riboflavin_mg: "Riboflavina (mg)",
  niacin_mg: "Niacina (mg)",
  vitB6_mg: "Vitamina B6 (mg)",
  folate_mcg: "Folato (mcg)",
  vitB12_mcg: "Vitamina B12 (mcg)",
  vitA_mcg: "Vitamina A (mcg)",
  vitE_mg: "Vitamina E (mg)",
  vitD2_mcg: "Vitamina D2 (mcg)",
};

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
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [columnModalIsOpen, setColumnModalIsOpen] = useState(false);
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
  
    if (selectedColumns.length > 7) {
      alert("Você pode selecionar no máximo 7 valores.");
      return;
    }
  
    setShowWarning(false);
    const filteredData = filterDataByDateRange(startDate, endDate);
  
    // Calculando os totais
    const totals = filteredData.reduce(
      (acc, data) => {
        selectedColumns.forEach((col) => {
          acc[col] += data[col] ?? 0;
        });
        return acc;
      },
      selectedColumns.reduce((acc, col) => {
        acc[col] = 0;
        return acc;
      }, {} as any)
    );
  
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
      ...selectedColumns.map((col) => columnLabels[col]),
    ];
    const tableRows: any = [];
  
    filteredData.forEach((data) => {
      const dataRow = [
        new Date(data.createdAt).toLocaleDateString(),
        ...selectedColumns.map((col) => (data[col] ?? 0).toFixed(2)),
      ];
      tableRows.push(dataRow);
    });
  
    // Adicionando a linha de total
    const totalRow = [
      "Total",
      ...selectedColumns.map((col) => totals[col].toFixed(2)),
    ];
    tableRows.push(totalRow);
  
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
    setColumnModalIsOpen(false); // Fecha o modal após o download
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

  const handleColumnSelection = (column: string) => {
    setSelectedColumns((prev) => {
      if (prev.includes(column)) {
        return prev.filter((col) => col !== column);
      } else if (prev.length < 7) {
        return [...prev, column];
      } else {
        return prev;
      }
    });
  };

  const openColumnModal = () => {
    setColumnModalIsOpen(true);
  };

  const closeColumnModal = () => {
    setColumnModalIsOpen(false);
  };

  return (
    <SidebarPage headerTitle="Dashboard">
      <TutorialDashboard />
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
            onClick={openColumnModal}
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
                      chartType={chartType as "line" | "bar" | "pie" | "doughnut" | "radar" | "polarArea"}
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

      <Modal open={columnModalIsOpen} onClose={closeColumnModal}>
  <Box
    sx={{
      position: "relative",
      width: { xs: "90%", md: "60%" },
      maxHeight: "80%",
      margin: "auto",
      marginTop: "5%",
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: 24,
      p: 4,
      overflow: "auto",
    }}
  >
    <div className="flex flex-col md:flex-row justify-center mt-4">
      <div className="mb-4 md:mb-0 md:mr-4">
        <DatePicker
          selected={startDate}
          onChange={(date: Date | null) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          isClearable
          placeholderText="Start Date"
          className="border p-2 rounded-lg placeholder-center w-full"
        />
      </div>
      <div className="mb-4 md:mb-0 md:mr-4">
        <DatePicker
          selected={endDate}
          onChange={(date: Date | null) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          isClearable
          placeholderText="End Date"
          className="border p-2 rounded-lg placeholder-center w-full text-black"
        />
      </div>
      <div className="md:ml-4">
        <select
          onChange={handleDropdownChange}
          className="border p-2 rounded-lg w-full"
        >
          <option value="">Selecione</option>
          <option value="weekly">Semanal</option>
          <option value="monthly">Mensal</option>
        </select>
      </div>
    </div>
    {showWarning && (
      <p className="text-red-500 mt-2 text-center">
        Por favor, selecione o intervalo de datas.
      </p>
    )}

    <h2 className="text-lg mt-4 mb-4 text-center">Selecione até 7 valores para adicionar ao PDF</h2>

    <div className="flex flex-wrap justify-center mt-4 max-w-4xl mx-auto">
      {availableColumns.map((column) => (
        <FormControlLabel
          key={column}
          control={
            <Checkbox
              checked={selectedColumns.includes(column)}
              onChange={() => handleColumnSelection(column)}
              name={column}
              disabled={
                selectedColumns.length >= 7 && !selectedColumns.includes(column)
              }
            />
          }
          label={columnLabels[column]}
          className="mr-4 mb-2"
        />
      ))}
    </div>

    <div className="flex justify-end mt-4">
      <Button variant="contained" color="primary" onClick={downloadPDF}>
        Baixar PDF
      </Button>
    </div>
  </Box>
</Modal>
    </SidebarPage>
  );
};

export default Dashboard;
