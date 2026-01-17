import { useEffect, useState, useContext } from "react";
import { BACKEND, SocketContext } from "../utils.tsx";
import { Player } from "../interfaces/Player.tsx";
import { useLocation } from "react-router-dom";

// Must match the backend goal score for visuals to make sense
const GOAL_SCORE = 5000;

function StreamerLeaderboard() {
  const socket = useContext(SocketContext);
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();

  // State for team scores
  const [teamScores, setTeamScores] = useState({ red: 0, blue: 0 });

  // Fetch Logic
  const fetchData = () => {
    // 1. Get Individual Leaderboard
    fetch(BACKEND + "/leaderboard")
      .then((res) => res.json())
      .then((data) => setLeaderboard(data.leaderboard));

    // 2. Get Team Totals (Players + Scripted Modifiers)
    fetch(BACKEND + "/get_team_scores")
      .then((res) => res.json())
      .then((data) => setTeamScores({ red: data.red, blue: data.blue }));
  };

  useEffect(() => {
    fetchData();

    // Listen for real-time updates
    socket.on("score_updated", fetchData);
    socket.on("team_score_update", fetchData);
    socket.on("results", fetchData);

    return () => {
      socket.off("score_updated");
      socket.off("team_score_update");
      socket.off("results");
    };
  }, [socket]);

  // --- NEW: Handle Manual Score Updates ---
  const handleScoreChange = (username: string, newScore: number) => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("score", newScore.toString());

    fetch(BACKEND + "/update_score", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then(() => {
        // No need to setLeaderboard manually here;
        // the backend emits 'score_updated' which triggers fetchData()
        console.log(`Updated ${username} to ${newScore}`);
      })
      .catch((err) => console.error("Error updating score:", err));
  };

  // Handler for the narrative buttons
  const triggerScriptedEvent = (eventType: string) => {
    fetch(BACKEND + "/trigger_scripted_event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_type: eventType }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Event triggered:", data);
        fetchData();
      })
      .catch((err) => console.error("Error triggering event:", err));
  };

  // Calculate widths for progress bars (capped at 100%)
  const redPercent = Math.min(100, Math.max(0, (teamScores.red / GOAL_SCORE) * 100));
  const bluePercent = Math.min(100, Math.max(0, (teamScores.blue / GOAL_SCORE) * 100));

  const filteredLeaderboard = leaderboard.filter((player) =>
    player.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="flex flex-col items-center h-screen w-screen bg-gray-100 p-4"
      key={location.key}
    >
      {/* --- DASHBOARD HEADER & CONTROLS --- */}
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
          Live Narrative Control
        </h2>

        {/* Progress Bars */}
        <div className="flex w-full gap-8 mb-8 items-end">
          {/* FBI (Blue) Bar */}
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <span className="font-bold text-blue-700 text-lg">FBI / RA</span>
              <span className="font-bold text-blue-700 text-lg">{teamScores.blue}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-8 border-2 border-blue-200 relative overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-1000 ease-in-out flex items-center justify-end px-2"
                style={{ width: `${bluePercent}%` }}
              >
                <span className="text-white text-xs font-bold">{Math.floor(bluePercent)}%</span>
              </div>
            </div>
          </div>

          {/* VS Badge */}
          <div className="font-black text-3xl text-gray-300 pb-1">VS</div>

          {/* Mafia (Red) Bar */}
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <span className="font-bold text-red-700 text-lg">MCUT MAFIA</span>
              <span className="font-bold text-red-700 text-lg">{teamScores.red}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-8 border-2 border-red-200 relative overflow-hidden">
              <div
                className="bg-red-600 h-full rounded-full transition-all duration-1000 ease-in-out flex items-center justify-end px-2"
                style={{ width: `${redPercent}%` }}
              >
                <span className="text-white text-xs font-bold">{Math.floor(redPercent)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scripted Event Buttons */}
        <div className="grid grid-cols-2 gap-8">
          {/* EVENT 1: Betray FBI */}
          <button
            onClick={() => triggerScriptedEvent("betray_fbi")}
            className="bg-red-900 hover:bg-red-950 active:bg-red-800 text-white font-bold py-4 px-6 rounded-lg shadow-lg border-b-4 border-red-700 flex flex-col items-center transition-transform hover:scale-[1.01]"
          >
            <span className="text-2xl mb-1">⚡ EVENT 1: Betray FBI</span>
            <span className="text-sm font-normal text-red-200">
              Set FBI to 1500 pts BEHIND Mafia
            </span>
          </button>

          {/* EVENT 2: The Equalizer */}
          <button
            onClick={() => triggerScriptedEvent("equalize")}
            className="bg-purple-900 hover:bg-purple-950 active:bg-purple-800 text-white font-bold py-4 px-6 rounded-lg shadow-lg border-b-4 border-purple-700 flex flex-col items-center transition-transform hover:scale-[1.01]"
          >
            <span className="text-2xl mb-1">⚡ EVENT 2: The Equalizer</span>
            <span className="text-sm font-normal text-purple-200">
              Set BOTH teams to 90% (Tie Game)
            </span>
          </button>
        </div>
      </div>

      {/* --- PLAYER LEADERBOARD --- */}
      <div className="w-full max-w-3xl flex flex-col items-center flex-grow overflow-hidden">
        <div className="w-full flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Search players..."
            className="flex-grow px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button
            className="px-6 py-2 rounded-lg text-white font-bold bg-purple-600 hover:bg-purple-700 shadow-md whitespace-nowrap"
            onClick={() => {
              const randomPlayerIndex = Math.floor(Math.random() * leaderboard.length);
              const updatedLeaderboard = leaderboard.map((player, index) => ({
                ...player,
                isHighlighted: index === randomPlayerIndex,
              }));
              setLeaderboard(updatedLeaderboard);
            }}
          >
            Pick Random Winner
          </button>
        </div>

        {/* Scrollable List */}
        <div className="w-full flex-grow overflow-y-auto bg-white rounded-xl shadow-inner p-2 border border-gray-200">
          {filteredLeaderboard.map((player, index) => (
            <div
              key={player.username}
              className={`flex items-center justify-between p-3 mb-2 rounded-lg border ${
                player.isHighlighted
                  ? "bg-yellow-100 border-yellow-400 shadow-sm transform scale-[1.02]"
                  : "bg-gray-50 border-gray-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full font-bold text-gray-600 text-sm">
                  {index + 1}
                </div>
                <span className="font-bold text-lg text-gray-800">{player.username}</span>
              </div>

              <div className="flex items-center gap-4">
                {/* Team Badge */}
                {player.team === "red" && (
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-bold rounded">
                    MAFIA
                  </span>
                )}
                {player.team === "blue" && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded">
                    FBI
                  </span>
                )}

                {/* Editable Score Input */}
                <input
                  type="number"
                  className="w-20 px-2 py-1 text-right font-mono font-bold text-xl text-gray-700 border border-gray-300 rounded focus:outline-none focus:border-purple-500"
                  value={player.score}
                  onChange={(e) => handleScoreChange(player.username, Number(e.target.value))}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StreamerLeaderboard;
