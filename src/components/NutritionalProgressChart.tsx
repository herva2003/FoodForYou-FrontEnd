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
  Energy_kcal: number;
  Protein_g: number;
  Saturated_fats_g: number;
  Fat_g: number;
  Carb_g: number;
  Fiber_g: number;
  Sugar_g: number;
  Calcium_mg: number;
  Iron_mg: number;
  Magnesium_mg: number;
  Phosphorus_mg: number;
  Potassium_mg: number;
  Sodium_mg: number;
  Zinc_mg: number;
  Copper_mcg: number;
  Manganese_mg: number;
  Selenium_mcg: number;
  VitC_mg: number;
  Thiamin_mg: number;
  Riboflavin_mg: number;
  Niacin_mg: number;
  VitB6_mg: number;
  Folate_mcg: number;
  VitB12_mcg: number;
  VitA_mcg: number;
  VitE_mg: number;
  VitD2_mcg: number;
}

interface NutritionalProgressChartProps {
    startDate: Date | null;
    endDate: Date | null;
    chartType: 'line' | 'bar' | 'pie' | 'doughnut' | 'radar' | 'polarArea' | 'bubble' | 'scatter';
}

// const mockData: NutritionalData[] = [
//   {
//     createdAt: "2024-05-30T20:06:17.294Z",
//     Energy_kcal: 717,
//     Protein_g: 0.85,
//     Saturated_fats_g: 51.368,
//     Fat_g: 81.11,
//     Carb_g: 0.06,
//     Fiber_g: 0,
//     Sugar_g: 0.06,
//     Calcium_mg: 24,
//     Iron_mg: 0.02,
//     Magnesium_mg: 2,
//     Phosphorus_mg: 24,
//     Potassium_mg: 24,
//     Sodium_mg: 643,
//     Zinc_mg: 0.09,
//     Copper_mcg: 0,
//     Manganese_mg: 0,
//     Selenium_mcg: 1,
//     VitC_mg: 0,
//     Thiamin_mg: 0.005,
//     Riboflavin_mg: 0.034,
//     Niacin_mg: 0.042,
//     VitB6_mg: 0.003,
//     Folate_mcg: 3,
//     VitB12_mcg: 0.17,
//     VitA_mcg: 684,
//     VitE_mg: 2.32,
//     VitD2_mcg: 0
//   },
//   {
//     createdAt: "2024-05-31T20:31:10.917Z",
//     Energy_kcal: 376,
//     Protein_g: 25.18,
//     Saturated_fats_g: 18.584,
//     Fat_g: 29.2,
//     Carb_g: 3.06,
//     Fiber_g: 0,
//     Sugar_g: 0,
//     Calcium_mg: 673,
//     Iron_mg: 0.64,
//     Magnesium_mg: 22,
//     Phosphorus_mg: 490,
//     Potassium_mg: 93,
//     Sodium_mg: 690,
//     Zinc_mg: 2.94,
//     Copper_mcg: 0.024,
//     Manganese_mg: 0.021,
//     Selenium_mcg: 14.5,
//     VitC_mg: 0,
//     Thiamin_mg: 0.031,
//     Riboflavin_mg: 0.45,
//     Niacin_mg: 0.18,
//     VitB6_mg: 0.074,
//     Folate_mcg: 18,
//     VitB12_mcg: 0.27,
//     VitA_mcg: 271,
//     VitE_mg: 0,
//     VitD2_mcg: 0
//   },
//   {
//     createdAt: "2024-06-01T20:31:10.917Z",
//     Energy_kcal: 91.77600000000001,
//     Protein_g: 16.22,
//     Saturated_fats_g: 1.127,
//     Fat_g: 2.92,
//     Carb_g: 0,
//     Fiber_g: 0,
//     Sugar_g: 0,
//     Calcium_mg: 14.15,
//     Iron_mg: 6.11,
//     Magnesium_mg: 17.46,
//     Phosphorus_mg: 204,
//     Potassium_mg: 198,
//     Sodium_mg: 163,
//     Zinc_mg: 1.92,
//     Copper_mcg: 0.38,
//     Manganese_mg: 0.69,
//     Selenium_mcg: 127,
//     VitC_mg: 0,
//     Thiamin_mg: 0.35,
//     Riboflavin_mg: 0.31,
//     Niacin_mg: 5.51,
//     VitB6_mg: 0.51,
//     Folate_mcg: 46.21,
//     VitB12_mcg: 0,
//     VitA_mcg: 0,
//     VitE_mg: 0.1,
//     VitD2_mcg: 0
//   },
//   {
//     createdAt: "2024-06-01T20:31:10.917Z",
//     Energy_kcal: 385,
//     Protein_g: 8.4,
//     Saturated_fats_g: 0.63,
//     Fat_g: 3.2,
//     Carb_g: 81.2,
//     Fiber_g: 2.9,
//     Sugar_g: 0,
//     Calcium_mg: 9,
//     Iron_mg: 1.17,
//     Magnesium_mg: 114,
//     Phosphorus_mg: 320,
//     Potassium_mg: 275,
//     Sodium_mg: 167,
//     Zinc_mg: 2.22,
//     Copper_mcg: 0.42,
//     Manganese_mg: 5.08,
//     Selenium_mcg: 0,
//     VitC_mg: 0,
//     Thiamin_mg: 0.08,
//     Riboflavin_mg: 0.10400000000000001,
//     Niacin_mg: 6.435,
//     VitB6_mg: 0.14,
//     Folate_mcg: 19,
//     VitB12_mcg: 0,
//     VitA_mcg: 0,
//     VitE_mg: 0,
//     VitD2_mcg: 0
//   },
// ]

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

  useEffect(() => {
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
  
    fetchData();
  }, [getToken]);
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
        data: mockData.map(data => data.Energy_kcal),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
      {
        label: 'Proteina (g)',
        data: mockData.map(data => data.Protein_g),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
      },
      {
        label: 'Gordura (g)',
        data: mockData.map(data => data.Fat_g),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
      {
        label: 'Carboidratos (g)',
        data: mockData.map(data => data.Carb_g),
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
      },
      {
        label: 'Açucar (g)',
        data: mockData.map(data => data.Sugar_g),
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
      },
      {
        label: 'Sal (mg)',
        data: mockData.map(data => data.Sodium_mg),
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