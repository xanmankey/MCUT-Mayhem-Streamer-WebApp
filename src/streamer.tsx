// For the streamer; shows either a pie chart for multiple choice responses, a bar graph for numerical responses, or a word cloud for free responses
import { createRoot } from "react-dom/client";
import "./index.css";

import { BACKEND, SocketProvider } from "./utils";
// Streamer side has routing
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import StreamerQuestions from "./components/streamer_questions";
import StreamerResponses from "./components/streamer_responses";
import StreamerLeaderboard from "./components/streamer_leaderboard";
import Timer from "./components/timer";

function AppRoutes() {
  const location = useLocation();
  console.log("Location changed:", location);

  return (
    <Routes key={location.key}>
      <Route path="/" element={<StreamerQuestions />} />
      {/* The below line is just for localhost testing */}
      <Route path="/streamer.html" element={<StreamerQuestions />} />
      <Route path="/responses" element={<StreamerResponses />} />
      <Route path="/leaderboard" element={<StreamerLeaderboard />} />
      <Route path="/timer" element={<Timer />} />
    </Routes>
  );
}
document.addEventListener("DOMContentLoaded", () => {
  console.log("Streamer loaded");
  const rootElement = document.getElementById("root");
  if (rootElement) {
    console.log("#root element is present:", rootElement);
  } else {
    console.error("Error: #root element is missing!");
  }
  createRoot(document.getElementById("root")!).render(
    <SocketProvider>
      <Router>
        <nav
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
            position: "fixed",
            top: 0,
            width: "100%",
            backgroundColor: "white",
            zIndex: 1000,
            padding: "10px 0",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <button style={{ margin: "0 10px", color: "black" }}>
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              Questions
            </Link>
          </button>
          <button style={{ margin: "0 10px", color: "black" }}>
            <Link
              to="/leaderboard"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Leaderboard
            </Link>
          </button>
          <button
            style={{ margin: "0 10px", backgroundColor: "red", color: "white" }}
            onClick={() => {
              fetch(BACKEND + "/reset_questions", { method: "POST" })
                .then((response) => {
                  if (!response.ok) {
                    throw new Error("Network response was not ok");
                  }
                  return response.json();
                })
                .then((data) => {
                  console.log("Questions reset:", data);
                  window.location.reload();
                })
                .catch((error) => {
                  console.error("Error resetting questions:", error);
                });
            }}
          >
            Reset Questions
          </button>
          <button
            style={{ margin: "0 10px", backgroundColor: "red", color: "white" }}
            onClick={() => {
              fetch(BACKEND + "/delete_players", { method: "POST" })
                .then((response) => {
                  if (!response.ok) {
                    throw new Error("Network response was not ok");
                  }
                  return response.json();
                })
                .then((data) => {
                  console.log("Players deleted:", data);
                  window.location.reload();
                })
                .catch((error) => {
                  console.error("Error deleting players:", error);
                });
            }}
          >
            Delete Players
          </button>
        </nav>
        <AppRoutes />
      </Router>
    </SocketProvider>
  );
});
