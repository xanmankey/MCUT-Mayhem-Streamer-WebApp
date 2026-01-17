import { createRoot } from "react-dom/client";
import "./index.css";

import { BACKEND, SocketContext, SocketProvider } from "./utils";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import StreamerQuestions from "./components/streamer_questions";
import StreamerResponses from "./components/streamer_responses";
import StreamerLeaderboard from "./components/streamer_leaderboard";
import Timer from "./components/timer";
import { useContext, useEffect, useState } from "react";

function AppRoutes() {
  const location = useLocation();

  return (
    <Routes key={location.key}>
      <Route path="/" element={<StreamerQuestions />} />
      <Route path="/streamer.html" element={<StreamerQuestions />} />
      <Route path="/responses" element={<StreamerResponses />} />
      <Route path="/leaderboard" element={<StreamerLeaderboard />} />
      <Route path="/timer" element={<Timer />} />
    </Routes>
  );
}

function MainApp() {
  const socket = useContext(SocketContext);
  const location = useLocation();

  // State: 'none' (hidden) or 'reveal' (shows FBI/Mafia based on team)
  const [overlayState, setOverlayState] = useState<"none" | "reveal">("none");

  useEffect(() => {
    console.log("Location changed:", location);
    socket.on("score_updated", (data) => {
      console.log("New score:", data);
    });

    return () => {
      socket.off("score_updated");
    };
  }, [location, socket]);

  // Toggle: Hidden -> Reveal (Split) -> Hidden
  const toggleOverlay = () => {
    const nextState = overlayState === "none" ? "reveal" : "none";
    setOverlayState(nextState);

    fetch(BACKEND + "/trigger_overlay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: nextState }),
    })
      .then((response) => response.json())
      .then((data) => console.log(`Overlay set to ${nextState}:`, data))
      .catch((error) => console.error("Error triggering overlay:", error));
  };

  // --- NEW: SCRIPTED EVENT TRIGGER ---
  const triggerScriptedEvent = (eventType: string) => {
    fetch(BACKEND + "/trigger_scripted_event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_type: eventType }),
    })
      .then((res) => res.json())
      .then((data) => console.log("Event triggered:", data))
      .catch((err) => console.error("Error triggering event:", err));
  };

  return (
    <>
      <nav
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: "20px",
          position: "fixed",
          top: 0,
          width: "100%",
          backgroundColor: "white",
          zIndex: 1000,
          padding: "10px 0",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          gap: "10px",
        }}
      >
        <button style={{ color: "black", border: "1px solid #ccc" }}>
          <Link to="/" style={{ textDecoration: "none", color: "inherit", padding: "5px 10px" }}>
            Questions
          </Link>
        </button>
        <button style={{ color: "black", border: "1px solid #ccc" }}>
          <Link
            to="/leaderboard"
            style={{ textDecoration: "none", color: "inherit", padding: "5px 10px" }}
          >
            Leaderboard
          </Link>
        </button>
        <div style={{ width: "20px" }}></div> {/* Spacer */}
        {/* --- GAME CONTROLS --- */}
        <button
          style={{ backgroundColor: "#6200ea", color: "white" }}
          onClick={() => {
            fetch(BACKEND + "/assign_teams", { method: "POST" })
              .then((res) => res.json())
              .then((data) => console.log("Teams assigned:", data));
          }}
        >
          Assign Teams
        </button>
        <button
          style={{
            backgroundColor: overlayState === "none" ? "gray" : "#d32f2f",
            color: "white",
            fontWeight: "bold",
          }}
          onClick={toggleOverlay}
        >
          {overlayState === "none" ? "Reveal Allegiance" : "Hide Allegiance"}
        </button>
        <div style={{ width: "20px" }}></div> {/* Spacer */}
        {/* --- SECRET EVENT BUTTONS (For Streamer Only) --- */}
        <button
          onClick={() => triggerScriptedEvent("betray_fbi")}
          style={{ backgroundColor: "#7f1d1d", color: "#fca5a5", border: "2px solid #991b1b" }}
        >
          ⚡ Betray FBI (-250)
        </button>
        <button
          onClick={() => triggerScriptedEvent("equalize")}
          style={{ backgroundColor: "#581c87", color: "#d8b4fe", border: "2px solid #6b21a8" }}
        >
          ⚡ Equalizer (Tie)
        </button>
        <div style={{ width: "20px" }}></div> {/* Spacer */}
        {/* --- RESET CONTROLS --- */}
        <button
          style={{ backgroundColor: "red", color: "white" }}
          onClick={() => {
            fetch(BACKEND + "/reset_questions", { method: "POST" })
              .then((res) => res.json())
              .then((data) => window.location.reload());
          }}
        >
          Reset Questions
        </button>
        <button
          style={{ backgroundColor: "red", color: "white" }}
          onClick={() => {
            fetch(BACKEND + "/delete_players", { method: "POST" })
              .then((res) => res.json())
              .then((data) => window.location.reload());
          }}
        >
          Delete Players
        </button>
      </nav>
      <div
        id="host-rating-div"
        style={{ position: "fixed", top: "10px", left: "70px", zIndex: 10000, fontSize: "2rem" }}
      ></div>
      <AppRoutes />
    </>
  );
}

document.addEventListener("DOMContentLoaded", () => {
  createRoot(document.getElementById("root")!).render(
    <SocketProvider>
      <Router>
        <MainApp />
      </Router>
    </SocketProvider>
  );
});
