import React, { useEffect, useState } from "react";
import SidebarPage from "../components/SidebarPage";
import DashboardWelcomeCard from "../components/DashboardWelcomeCard";
import NutritionalProgressChart from "../components/NutritionalProgressChart";
import api from "../services/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { UserProps } from "../interfaces/UserProps";

const Dashboard: React.FC = () => {
  const [userData, setUserData] = useState<UserProps | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie' | 'doughnut' | 'radar' | 'polarArea' | 'bubble' | 'scatter'>('line');

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

  return (
    <SidebarPage headerTitle="Dashboard">
      <div className="h-[80vh] pr-[100px] overflow-y-auto">
        <DashboardWelcomeCard 
          login={userData?.login ?? ""} 
          fullName={userData?.fullName ?? ""} 
          weight={userData?.weight ?? 0}
          height={userData?.height ?? 0}
          diets={userData?.diets ?? ""}
          allergies={userData?.allergies ?? ""}
          intolerances={userData?.intolerances ?? ""  }
          fetchData={fetchData}
        />
        <div className="mt-8">
          <div className="flex justify-center items-center mb-4">
            <div className="mr-4">
              <DatePicker
                selected={startDate}
                onChange={(date: Date | null) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                isClearable
                placeholderText="Start Date"
                className="border p-2 rounded"
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
                className="border p-2 rounded"
              />
            </div>
            <div>
              <select value={chartType} onChange={(e) => setChartType(e.target.value as 'line' | 'bar' | 'pie' | 'doughnut' | 'radar' | 'polarArea' | 'bubble' | 'scatter')}>
                <option value="line">Linha</option>
                <option value="bar">Barra</option>
                <option value="pie">Torta</option>
                <option value="doughnut">Rosca</option>
                <option value="radar">Radar</option>
                <option value="polarArea">Área Polar</option>
                <option value="bubble">Bolha</option>
                <option value="scatter">Dispersão</option>
              </select>
            </div>
          </div>
          <div className="mt-[50px]">
            <NutritionalProgressChart chartType={chartType} startDate={startDate} endDate={endDate} />
          </div>
        </div>
      </div>
    </SidebarPage>
  );
};

export default Dashboard;
