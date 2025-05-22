import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { FiveElements, ElementType } from '../../types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface FiveElementsChartProps {
  elements: FiveElements;
}

const FiveElementsChart: React.FC<FiveElementsChartProps> = ({ elements }) => {
  const backgroundColors = {
    wood: 'rgba(114, 188, 74, 0.8)',
    fire: 'rgba(239, 68, 68, 0.8)',
    earth: 'rgba(207, 176, 77, 0.8)',
    metal: 'rgba(107, 114, 128, 0.8)',
    water: 'rgba(59, 130, 246, 0.8)',
  };
  
  const borderColors = {
    wood: 'rgba(114, 188, 74, 1)',
    fire: 'rgba(239, 68, 68, 1)',
    earth: 'rgba(207, 176, 77, 1)',
    metal: 'rgba(107, 114, 128, 1)',
    water: 'rgba(59, 130, 246, 1)',
  };
  
  const labels = {
    wood: 'Wood',
    fire: 'Fire',
    earth: 'Earth',
    metal: 'Metal',
    water: 'Water',
  };

  const data = {
    labels: Object.keys(elements).map(key => labels[key as ElementType]),
    datasets: [
      {
        data: Object.values(elements),
        backgroundColor: Object.keys(elements).map(key => backgroundColors[key as ElementType]),
        borderColor: Object.keys(elements).map(key => borderColors[key as ElementType]),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: {
            family: 'Raleway',
            size: 13,
          },
          padding: 20,
          color: '#2C2E2B',
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#2C2E2B',
        titleFont: {
          family: 'Montserrat',
          size: 14,
          weight: '600',
        },
        bodyColor: '#2C2E2B',
        bodyFont: {
          family: 'Raleway',
          size: 13,
        },
        padding: 12,
        boxPadding: 6,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const value = context.raw;
            const percentage = Math.round((value / total) * 100);
            return `${percentage}%`;
          }
        }
      }
    },
    cutout: '65%',
  };

  return (
    <div className="aspect-square max-w-xs mx-auto my-6">
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default FiveElementsChart;