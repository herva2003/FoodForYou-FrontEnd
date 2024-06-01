// NutritionalProgressChart.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Bar, Line, Pie, Doughnut, Radar, PolarArea, Bubble, Scatter, ChartComponent } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import 'chart.js/auto';
import api from "../services/api"
import { useAuth } from "../context/authContext";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface NutritionalData {
  id: string;
  createdAt: string;
  energy_kcal: number;
  protein_g: number;
  saturated_fats_g: number;
  fat_g: number;
  carb_g: number;
  fiber_g: number;
  sugar_g: number;
  calcium_mg: number;
  iron_mg: number;
  magnesium_mg: number;
  phosphorus_mg: number;
  Potassium_mg: number;
  sodium_mg: number;
  zinc_mg: number;
  copper_mcg: number;
  manganese_mg: number;
  selenium_mcg: number;
  vitC_mg: number;
  thiamin_mg: number;
  riboflavin_mg: number;
  niacin_mg: number;
  vitB6_mg: number;
  folate_mcg: number;
  vitB12_mcg: number;
  vitA_mcg: number;
  vitE_mg: number;
  vitD2_mcg: number;
}

interface NutritionalProgressChartProps {
    startDate: Date | null;
    endDate: Date | null;
    chartType: 'line' | 'bar' | 'pie' | 'doughnut' | 'radar' | 'polarArea' | 'bubble' | 'scatter';
}


const normalizeDate = (date: Date) => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

const NutritionalProgressChart: React.FC<NutritionalProgressChartProps> = ({ startDate, endDate, chartType }) => {
  const normalizedStartDate = startDate ? normalizeDate(startDate) : null;
  const normalizedEndDate = endDate ? normalizeDate(endDate) : null;
  const { getToken } = useAuth();

  const [mockData, setMockData] = useState<NutritionalData[]>([]);

  const fetchData = async () => {
    try {
      const token = await getToken();
      const response = await api.get("/api/v1/user/nv", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMockData(response.data.data);
    } catch (error) {
      console.error('Error fetching nutritional data:', error);
    }
  };
  useEffect(() => {
  
    fetchData();
  }, []);
  console.log(mockData)
  
  const filteredData = mockData.filter(data => {
    const createdAt = normalizeDate(new Date(data.createdAt));
    return (!normalizedStartDate || createdAt >= normalizedStartDate) && (!normalizedEndDate || createdAt <= normalizedEndDate);
  });


  const labels = filteredData.map(data => new Date(data.createdAt).toLocaleDateString());

  const data = {
    labels,
    datasets: [
      {
        label: 'Calorias (kcal)',
        data: mockData.map(data => data.energy_kcal),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
      {
        label: 'Proteina (g)',
        data: mockData.map(data => data.protein_g),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
      },
      {
        label: 'Gordura (g)',
        data: mockData.map(data => data.fat_g),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
      {
        label: 'Carboidratos (g)',
        data: mockData.map(data => data.carb_g),
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
      },
      {
        label: 'Açucar (g)',
        data: mockData.map(data => data.sugar_g),
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
      },
      {
        label: 'Sal (mg)',
        data: mockData.map(data => data.sodium_mg),
        borderColor: 'rgba(255, 206, 86, 1)',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
      }
    ],
  };


  const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,
            text: 'Nutritional Progress',
        },
    },
  };

    const chartRef = useRef<ChartComponent | null>(null);

    useEffect(() => {
        return () => {
            if (chartRef.current) {
                (chartRef.current as ChartComponent).destroy();
            }
        };
    }, [chartType]);

    let ChartComponent;
  switch (chartType) {
    case 'line':
      ChartComponent = Line;
      break;
    case 'bar':
      ChartComponent = Bar;
      break;
    case 'pie':
      ChartComponent = Pie;
      break;
    case 'doughnut':
      ChartComponent = Doughnut;
      break;
    case 'radar':
      ChartComponent = Radar;
      break;
    case 'polarArea':
      ChartComponent = PolarArea;
      break;
    case 'bubble':
      ChartComponent = Bubble;
      break;
    case 'scatter':
      ChartComponent = Scatter;
      break;
    default:
      return null;
  }

  return (
    mockData.length > 0 && (
      <ChartComponent
        data={data}
        options={options}
        ref={chartRef}
      />
    )
  );
};

export default NutritionalProgressChart;