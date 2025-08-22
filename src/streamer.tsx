// For the streamer; shows either a pie chart for multiple choice responses, a bar graph for numerical responses, or a word cloud for free responses
import { createRoot } from "react-dom/client";
import "./index.css";

import { BACKEND, SocketContext, SocketProvider } from "./utils";
// Streamer side has routing
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import StreamerQuestions from "./components/streamer_questions";
import StreamerResponses from "./components/streamer_responses";
import StreamerLeaderboard from "./components/streamer_leaderboard";
import StreamerHostRating from "./components/streamer_host_rating";
import Timer from "./components/timer";
import { useContext, useEffect, useState } from "react";

function AppRoutes() {
  const location = useLocation();

  return (
    <Routes key={location.key}>
      <Route path="/" element={<StreamerQuestions />} />
      {/* The below line is just for localhost testing */}
      <Route path="/streamer.html" element={<StreamerQuestions />} />
      <Route path="/responses" element={<StreamerResponses />} />
      <Route path="/leaderboard" element={<StreamerLeaderboard />} />
      <Route path="/hosts" element={<StreamerHostRating />} />
      <Route path="/timer" element={<Timer />} />
    </Routes>
  );
}

function MainApp() {
  const socket = useContext(SocketContext);
  const [score, setScore] = useState();
  const [hostImage, setHostImage] = useState();
  const location = useLocation();

  // This hook will now run on every page change because MainApp is
  // outside the <Routes> component
  useEffect(() => {
    console.log("Location changed:", location);
    socket.on("score_updated", (data) => {
      setScore(data.score);
      setHostImage(data.host_image);
      console.log("New score:", data);
    });

    return () => {
      socket.off("score_updated");
    };
  }, [location, socket]); // Reruns when location or socket changes

  // Set the host and score on initial load
  useEffect(() => {
    fetch(BACKEND + "/get_current_host_score")
      .then((response) => response.json())
      .then((data) => {
        setScore(data.score);
        setHostImage(data.host_image);
        console.log("Host and score set:", data);
      })
      .catch((error) => {
        console.error("Error fetching host data:", error);
      });
  }, [socket]);

  // Set the host and score on initial load
  useEffect(() => {
    socket.on("host_changed", (data) => {
      setHostImage(data.host_image);
      setScore("0");
    });

    return () => {
      socket.off("score_updated");
    };
  }, [location, socket, score]);

  return (
    <>
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
          <Link to="/leaderboard" style={{ textDecoration: "none", color: "inherit" }}>
            Leaderboard
          </Link>
        </button>
        <button style={{ margin: "0 10px", color: "black" }}>
          <Link to="/hosts" style={{ textDecoration: "none", color: "inherit" }}>
            Hosts
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
        <button
          style={{ margin: "0 10px", backgroundColor: "blue", color: "white" }}
          onClick={() => {
            socket.emit("change_host");
          }}
        >
          Change Host
        </button>
      </nav>
      <img
        src={hostImage}
        alt="Review Circle"
        className="rounded-full object-cover w-16 h-16"
        style={{
          position: "fixed",
          top: "0px",
          left: "5px",
          zIndex: 10000,
          border: "2px solid black",
        }}
      />
      <div
        id="host-rating-div"
        style={{
          position: "fixed",
          top: "10px",
          left: "70px",
          zIndex: 10000,
          fontSize: "2rem", // XL text
        }}
      >
        <b>'s Rating: {score}</b>
      </div>
      <AppRoutes />
    </>
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
        <MainApp />
      </Router>
    </SocketProvider>
  );
});
