import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  Title,
} from "chart.js";
import PropTypes from "prop-types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  Title
);

const ResultChart = ({ netArray, rawArray }) => {
  // Slice off the first element (index 0) from both arrays
  const slicedNetArray = netArray.slice(1);
  const slicedRawArray = rawArray.slice(1);

  const data = {
    labels: Array.from(
      { length: Math.max(slicedNetArray.length, slicedRawArray.length) },
      (_, i) => (i + 1).toString()
    ), // Generate labels based on the longest sliced array
    datasets: [
      {
        label: "Raw Speed",
        data: slicedRawArray, // Use the sliced rawArray data
        borderColor: "#6b7280",
        backgroundColor: "#6b7280",
        fill: false,
      },
      {
        label: "Net Speed",
        data: slicedNetArray, // Use the sliced netArray data
        borderColor: "#eab308",
        backgroundColor: "#eab308",
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Typing Speed Over Time",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Time (seconds)",
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Speed (WPM)",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div
      className="w-full h-full p-5"
      id="ResultChart-main"
      style={{ width: "1200px", maxWidth: "100%" }}
    >
      <Line data={data} options={options} />
    </div>
  );
};

// Define the propTypes
ResultChart.propTypes = {
  netArray: PropTypes.arrayOf(PropTypes.number).isRequired,
  rawArray: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default ResultChart;
