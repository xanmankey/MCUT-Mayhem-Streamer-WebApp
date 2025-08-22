// Bar graph showing host ratings and reviews for the selected host
import { useEffect, useRef, useState } from "react";

import { useLocation } from "react-router-dom";
import { BACKEND } from "../utils.tsx";

// import { HostReview } from "../interfaces/HostReview.tsx";
import { Chart } from "chart.js";

function StreamerHostRating() {
  const location = useLocation();
  // const navigate = useNavigate();
  const [scores, setScores] = useState<Record<string, number>>({});
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    fetch(BACKEND + "/get_scores")
      .then((response) => response.json())
      .then((data) => {
        setScores(data);
      });
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;
    const ctx = chartRef.current.getContext("2d");

    if (!ctx) return;

    // Create a vertical gradient for the bar background
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, "#2AE4E0");
    gradient.addColorStop(1, "#BC13FE");

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: Object.keys(scores),
        datasets: [
          {
            data: Object.values(scores),
            backgroundColor: Object.keys(scores).map(() => gradient),
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
  });

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen" key={location.key}>
      <canvas ref={chartRef} width={600} height={400} />
    </div>
  );
}
// Values are editable from the streamer end

export default StreamerHostRating;
