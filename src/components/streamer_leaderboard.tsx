import { useEffect, useState, useContext } from "react";
import { BACKEND, SocketContext } from "../utils.tsx";
import { Player } from "../interfaces/Player.tsx";
import { useLocation } from "react-router-dom";

const GOAL_SCORE = 1000;

function StreamerLeaderboard() {
  const socket = useContext(SocketContext);
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const [teamScores, setTeamScores] = useState({ red: 0, blue: 0 });
  const [showProgress, setShowProgress] = useState(false);

  const fetchData = () => {
    fetch(BACKEND + "/leaderboard")
      .then((res) => res.json())
      .then((data) => setLeaderboard(data.leaderboard));
    fetch(BACKEND + "/get_team_scores")
      .then((res) => res.json())
      .then((data) => setTeamScores({ red: data.red, blue: data.blue }));
  };

  useEffect(() => {
    fetchData();
    const handleOverlay = (data: { type: string }) => {
      console.log("Streamer Leaderboard received overlay update:", data.type);
      setShowProgress(data.type === "reveal");
    };
    socket.on("score_updated", fetchData);
    socket.on("show_overlay", handleOverlay);
    socket.on("team_score_update", fetchData);
    socket.on("results", fetchData);
    return () => {
      socket.off("show_overlay", handleOverlay);
      socket.off("score_updated");
      socket.off("team_score_update");
      socket.off("results");
    };
  }, [socket]);

  const handleScoreChange = (username: string, newScore: number) => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("score", newScore.toString());
    fetch(BACKEND + "/update_score", { method: "POST", body: formData })
      .then((res) => res.json())
      .then(() => console.log(`Updated ${username}`))
      .catch((err) => console.error(err));
  };

  const redPercent = Math.min(100, Math.max(0, (teamScores.red / GOAL_SCORE) * 100));
  const bluePercent = Math.min(100, Math.max(0, (teamScores.blue / GOAL_SCORE) * 100));
  const filteredLeaderboard = leaderboard.filter((player) =>
    player.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- HELPER FOR ROW STYLING ---
  const getRowStyle = (player: Player) => {
    if (player.isHighlighted) {
      return "bg-yellow-100 border-yellow-400 shadow-md transform scale-[1.02] z-10";
    }
    if (player.team === "red") {
      return "bg-red-50 border-red-200 hover:bg-red-100";
    }
    if (player.team === "blue") {
      return "bg-blue-50 border-blue-200 hover:bg-blue-100";
    }
    return "bg-gray-50 border-gray-100";
  };

  return (
    <div
      className="flex flex-col items-center h-screen w-screen bg-gray-100 pt-24"
      key={location.key}
    >
      {/* --- MAIN CONTENT --- */}
      <div className="flex flex-col items-center w-full p-4 flex-grow overflow-hidden">
        {/* Progress Bars - Wrapped in conditional rendering */}
        {showProgress && (
          <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-6 mb-6 transition-all animate-in fade-in slide-in-from-top-4">
            <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">Live Standings</h2>
            <div className="flex w-full gap-8 mb-4 items-end">
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="font-bold text-blue-700 text-lg">Police / RA</span>
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

              <div className="font-black text-3xl text-gray-300 pb-1">VS</div>

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
          </div>
        )}

        {/* Player Leaderboard */}
        <div className="w-full max-w-3xl flex flex-col items-center flex-grow overflow-hidden">
          <div className="w-full flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Search players..."
              className="flex-grow px-4 py-2 rounded-lg border border-gray-300 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="px-6 py-2 rounded-lg text-white font-bold bg-purple-600 hover:bg-purple-700 shadow-md"
              onClick={() => {
                const randomPlayerIndex = Math.floor(Math.random() * leaderboard.length);
                const updated = leaderboard.map((p, i) => ({
                  ...p,
                  isHighlighted: i === randomPlayerIndex,
                }));
                setLeaderboard(updated);
              }}
            >
              Pick Random Winner
            </button>
          </div>

          <div className="w-full flex-grow overflow-y-auto bg-white rounded-xl shadow-inner p-2 border border-gray-200">
            {filteredLeaderboard.map((player, index) => (
              <div
                key={player.username}
                className={`flex items-center justify-between p-3 mb-2 rounded-lg border transition-all ${getRowStyle(
                  player
                )}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-white rounded-full font-bold text-gray-600 text-sm shadow-sm">
                    {index + 1}
                  </div>
                  <span className="font-bold text-lg text-gray-800">{player.username}</span>
                </div>
                <div className="flex items-center gap-4">
                  {player.team === "red" && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-bold rounded border border-red-200">
                      MAFIA
                    </span>
                  )}
                  {player.team === "blue" && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded border border-blue-200">
                      FBI
                    </span>
                  )}
                  <input
                    type="number"
                    className="w-20 px-2 py-1 text-right font-mono font-bold text-xl text-gray-700 border border-gray-300 rounded focus:outline-none focus:border-purple-500 bg-white/50"
                    value={player.score}
                    onChange={(e) => handleScoreChange(player.username, Number(e.target.value))}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StreamerLeaderboard;
