// Bar graph showing host ratings and reviews for the selected host
import { useEffect, useRef } from "react";

import { useLocation } from "react-router-dom";
import { BACKEND } from "../utils.tsx";

// import { HostReview } from "../interfaces/HostReview.tsx";
import { Chart } from "chart.js";

function StreamerHostRating() {
  const location = useLocation();
  // const navigate = useNavigate();
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    fetch(BACKEND + "/get_scores")
      .then((response) => response.json())
      .then((data) => {
        if (!chartRef.current) return;
        const ctx = chartRef.current.getContext("2d");

        if (!ctx) return;

        // Destroy previous chart if it exists
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
          chartInstanceRef.current = null;
        }

        // Create a vertical gradient for the bar background
        if (ctx) {
          const labels = Object.keys(data);
          const vals = Object.values(data);
          const colors = ["#2AE4E0", "#BC13FE", "#E09B2A", "#A3E02A"];

          new Chart(ctx, {
            type: "bar",
            data: {
              labels: labels,
              datasets: [
                {
                  data: vals,
                  backgroundColor: colors,
                },
              ],
            },
            options: {
              plugins: {
                legend: {
                  display: false,
                },
                title: {
                  display: true,
                  text: "Host Ratings",
                  font: {
                    size: 24,
                    weight: "bold",
                  },
                  color: "black",
                },
              },
            },
          });
        }
        // Cleanup function to destroy chart when component unmounts
        return () => {
          if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
            chartInstanceRef.current = null;
          }
        };
      });
  }, [location]);

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen" key={location.key}>
      <canvas ref={chartRef} width={600} height={400} />
    </div>
  );
}
// Values are editable from the streamer end

export default StreamerHostRating;
