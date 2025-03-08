import { useEffect, useState } from "react";
import { BACKEND } from "../utils.tsx";

import { Player } from "../interfaces/Player.tsx";
import { useLocation } from "react-router-dom";

function StreamerLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();

  useEffect(() => {
    fetch(BACKEND + "/leaderboard")
      .then((response) => response.json())
      .then((data) => {
        setLeaderboard(data.leaderboard);
      });
  }, []);

  const handleScoreChange = (username: string, scoreChange: number) => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("score", scoreChange.toString()); // Ensure score is a string
    fetch(BACKEND + "/update_score", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setLeaderboard(data.leaderboard);
      });
  };

  const filteredLeaderboard = leaderboard.filter((player) =>
    player.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="flex flex-col items-center justify-center h-screen w-screen"
      key={location.key}
    >
      <input
        type="text"
        placeholder="Search by username"
        className="w-64 px-4 py-2 mb-4 rounded-full border border-gray-300 focus:outline-none"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button
        className="w-64 px-4 py-2 mb-4 rounded-full text-white focus:outline-none bg-purple-600"
        onClick={() => {
          const randomPlayerIndex = Math.floor(
            Math.random() * leaderboard.length
          );
          const updatedLeaderboard = leaderboard.map((player, index) => ({
            ...player,
            isHighlighted: index === randomPlayerIndex,
          }));
          setLeaderboard(updatedLeaderboard);
        }}
      >
        Choose Random Player
      </button>
      <div className="overflow-y-auto w-64">
        {filteredLeaderboard.map((player, index) => (
          <div
            key={player.username}
            className={`bg-white shadow-md rounded-lg p-4 mb-4 flex items-center justify-between ${
              player.isHighlighted ? "bg-yellow-300" : ""
            }`}
          >
            <p className="font-bold">
              {index + 1}. {player.username}
            </p>
            <input
              type="number"
              className="w-16 px-2 py-1 rounded border border-gray-300 focus:outline-none"
              defaultValue={player.score}
              onChange={(e) =>
                handleScoreChange(player.username, Number(e.target.value))
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default StreamerLeaderboard;
